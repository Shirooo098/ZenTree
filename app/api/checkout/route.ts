import { auth } from "@/app/lib/auth";
import { db } from "@/db/drizzle";
import { 
    cart_products, 
    carts, 
    order_status, 
    orders,
    order_products,
    products 
} from "@/db/schema";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { eq, and, inArray } from "drizzle-orm";
import { createPayPalOrder } from "@/config/config-paypal";

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
        const { checkoutItems } = body;

        if (!checkoutItems || checkoutItems.length === 0 || !Array.isArray(checkoutItems)) {
            return NextResponse.json(
                { error: "No items selected for checkout" },
                { status: 400 }
            );
        }

          
        const cartProductIds = checkoutItems.map((item: any) => item.cartProductId);

        const selectedCartItems = await getSelectedCartItems(cartProductIds, userId);

        if (selectedCartItems.length === 0) {
            return NextResponse.json(
                { error: "No valid items found" },
                { status: 404 }
            );
        }

        if (!verifyUserOwnership(selectedCartItems, userId)) {
            return NextResponse.json(
                { error: "Unauthorized access to cart items" },
                { status: 403 }
            );
        }

          
        const itemsWithUpdatedQuantities = selectedCartItems.map(item => {
            const checkoutItem = checkoutItems.find(
                (ci: any) => ci.cartProductId === item.cart_products_id
            );
            return {
                ...item,
                quantity: checkoutItem ? checkoutItem.quantity : item.quantity
            };
        });

        const stockError = checkStockAvailability(itemsWithUpdatedQuantities);
        if (stockError) {
            return NextResponse.json(
                { error: stockError },
                { status: 400 }
            );
        }

        const paypalOrder = await createPayPalOrder(
            itemsWithUpdatedQuantities.map(item => ({
                product_id: item.product_id,
                product_name: item.product_name,
                quantity: item.quantity,
                product_price: item.product_price
            }))
        )

        const pendingOrderStatus = await getOrderStatus('pending');
        if (!pendingOrderStatus) {
            return NextResponse.json(
                { error: "Order status configuration error" },
                { status: 500 }
            );
        }

        const newOrder = await createOrder(
            userId,
            pendingOrderStatus.order_status_id,
            paypalOrder.orderId
        );

        await processOrderItems(newOrder.order_id, itemsWithUpdatedQuantities);

        await db
            .update(orders)
            .set({ 
                payment_status: 'awaiting_payment'
            })
            .where(eq(orders.order_id, newOrder.order_id));

        const total = calculateTotal(itemsWithUpdatedQuantities);

        return NextResponse.json({
            success: true,
            message: "Order placed, awaiting payment",
            order: {
                order_id: newOrder.order_id,
                paypal_order_id: paypalOrder.orderId,
                approval_url: paypalOrder.approvalUrl,
                total,
                itemCount: itemsWithUpdatedQuantities.length,
                items: itemsWithUpdatedQuantities.map(item => ({
                    product_id: item.product_id,
                    product_name: item.product_name,
                    quantity: item.quantity,
                    price: Number(item.product_price)
                })),
                cart_product_ids: cartProductIds
            }
        });

    } catch (error) {
        console.error("Error during checkout:", error);
        return NextResponse.json(
            { error: "Failed to process checkout" },
            { status: 500 }
        );
    }
}

async function getSelectedCartItems(cartProductIds: number[], userId: string) {
    return await db
        .select({
            cart_products_id: cart_products.cart_products_id,
            cart_id: cart_products.cart_id,
            product_id: cart_products.product_id,
            quantity: cart_products.quantity,
            product_price: products.product_price,
            product_name: products.product_name,
            stock: products.stock,
            user_id: carts.user_id
        })
        .from(cart_products)
        .innerJoin(carts, eq(cart_products.cart_id, carts.cart_id)) 
        .innerJoin(products, eq(cart_products.product_id, products.product_id))
        .where(
            and(
                inArray(cart_products.cart_products_id, cartProductIds),
                eq(carts.user_id, userId)
            )
        );
}

function verifyUserOwnership(items: any[], userId: string): boolean {
    return items.every(item => item.user_id === userId);
}

function checkStockAvailability(items: any[]): string | null {
    const insufficientStockItems = items.filter(
        item => item.stock < item.quantity
    );

    if (insufficientStockItems.length > 0) {
        const itemNames = insufficientStockItems
            .map(item => item.product_name)
            .join(", ");
        return `Insufficient stock for: ${itemNames}`;
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

async function processOrderItems(orderId: number, items: any[]) {
    const promises = items.map(async (item) => {
        await db.insert(order_products).values({
            order_id: orderId,
            product_id: item.product_id,
            quantity: item.quantity,
            price_at_purchase: Number(item.product_price)
        });
    });

    await Promise.all(promises);
}

function calculateTotal(items: any[]): number {
    const total = items.reduce(
        (sum, item) => sum + (Number(item.product_price) * item.quantity),
        0
    );
    return Number(total.toFixed(2));
}