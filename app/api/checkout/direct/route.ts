import { auth } from "@/app/lib/auth";
import { db } from "@/db/drizzle";
import { eq, inArray } from "drizzle-orm";
import { products, orders, order_products, order_status } from "@/db/schema";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createPayPalOrder } from "@/config/config-paypal";

interface DirectCheckoutItem {
    productId: number;
    quantity: number;
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = session.user.id;
        const body = await req.json();
        const { items } = body;

        const validationError = validateItems(items);
        if (validationError) {
            return NextResponse.json(
                { error: validationError },
                { status: 400 }
            );
        }

        const productIds = items.map((item: DirectCheckoutItem) => item.productId);
        const productsData = await getProducts(productIds);
        
        if (productsData.length !== items.length) {
            return NextResponse.json(
                { error: "Some products not found" },
                { status: 404 }
            );
        }

        const productMap = createProductMap(productsData);
        const stockError = validateStock(items, productMap);
        if (stockError) {
            return NextResponse.json(
                { error: stockError },
                { status: 400 }
            );
        }

        // Get order status
        const newOrderStatus = await getOrderStatus('pending');
        if (!newOrderStatus) {
        // Prepare items for PayPal
        const paypalItems = items.map((item: DirectCheckoutItem) => {
            const product = productMap.get(item.productId)!;
            return {
                product_id: item.productId,
                product_name: product.product_name,
                quantity: item.quantity,
                product_price: product.product_price
            };
        });

        // Create PayPal order
        const paypalOrder = await createPayPalOrder(paypalItems);

        // Get pending order status
        const pendingOrderStatus = await getOrderStatus('pending');
        if (!pendingOrderStatus) {
            return NextResponse.json(
                { error: "Order status configuration error" },
                { status: 500 }
            );
        }

        // Create order with pending status
        const newOrder = await createOrder(
            userId, 
            pendingOrderStatus.order_status_id,
            paypalOrder.orderId
        );

        const { totalAmount, orderItems } = await processOrderItems(
            newOrder.order_id,
            items,
            productMap,
            false // Don't decrement stock until payment confirmed
        );

        return NextResponse.json({
            success: true,
            message: "Order created, awaiting payment",
            order: {
                order_id: newOrder.order_id,
                paypal_order_id: paypalOrder.orderId,
                approval_url: paypalOrder.approvalUrl,
                total: Number(totalAmount.toFixed(2)),
                itemCount: items.length,
                items: orderItems
            }
        });

    } catch (error) {
        console.error("Error during direct checkout:", error);
        return NextResponse.json(
            { error: "Failed to process checkout" },
            { status: 500 }
        );
    }
}

function validateItems(items: any): string | null {
    if (!items || !Array.isArray(items) || items.length === 0) {
        return "No items provided";
    }

    const invalidItems = items.filter(
        item => !item.productId || !item.quantity || item.quantity < 1
    );

    if (invalidItems.length > 0) {
        return "Invalid item format";
    }

    return null;
}

async function getProducts(productIds: number[]) {
    return await db
        .select()
        .from(products)
        .where(inArray(products.product_id, productIds));
}

function createProductMap(productsData: any[]) {
    return new Map(
        productsData.map(p => [p.product_id, p])
    );
}

function validateStock(items: DirectCheckoutItem[], productMap: Map<number, any>): string | null {
    const stockErrors: string[] = [];
    
    items.forEach(item => {
        const product = productMap.get(item.productId);
        if (product && product.stock < item.quantity) {
            stockErrors.push(
                `${product.product_name}: Only ${product.stock} available, requested ${item.quantity}`
            );
        }
    });

    if (stockErrors.length > 0) {
        return `Insufficient stock:\n${stockErrors.join('\n')}`;
    }

    return null;
}

async function getOrderStatus(statusName: string) {
    const [status] = await db
        .select()
        .from(order_status)
        .where(eq(order_status.order_status_name, statusName))
        .limit(1);

    return status;
}

async function createOrder(
    userId: string, 
    orderStatusId: number,
    paypalOrderId: string
) {
    const [newOrder] = await db
        .insert(orders)
        .values({
            user_id: userId,
            order_status_id: orderStatusId,
            paypal_order_id: paypalOrderId,
            payment_status: 'pending'
        })
        .returning();

    return newOrder;
}

async function processOrderItems(
    orderId: number,
    items: DirectCheckoutItem[],
    productMap: Map<number, any>,
    decrementStock: boolean 
) {
    let totalAmount = 0;
    const orderItems = [];
    decrementStock = false;

    for (const item of items) {
        const product = productMap.get(item.productId)!;
        
        // Insert order product
        await db.insert(order_products).values({
            order_id: orderId,
            product_id: item.productId,
            quantity: item.quantity,
            price_at_purchase: Number(product.product_price)
        });

        // Only decrement stock if payment is confirmed
        if (decrementStock) {
            await db
                .update(products)
                .set({
                    stock: product.stock - item.quantity
                })
                .where(eq(products.product_id, item.productId));
        }

        const itemTotal = Number(product.product_price) * item.quantity;
        totalAmount += itemTotal;

        orderItems.push({
            product_id: item.productId,
            product_name: product.product_name,
            quantity: item.quantity,
            price: Number(product.product_price),
            subtotal: itemTotal
        });
    }

    return { totalAmount, orderItems };
}