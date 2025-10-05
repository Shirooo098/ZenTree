import { auth } from "@/app/lib/auth";
import { db } from "@/db/drizzle";
import { cart_products, cart_status, carts, imageKit_productFiles, products } from "@/db/schema";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

export async function GET() {
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
        const newStatus = await getCartStatus('new');

        if (!newStatus) {
            return NextResponse.json(
                { error: "Cart Status Configuration error" },
                { status: 500 }
            );
        }

        const activeCart = await getActiveCart(userId, newStatus.cart_status_id);

        if (!activeCart) {
            return NextResponse.json({
                success: true,
                cart: createEmptyCart()
            });
        }

        const cartItems = await getCartItems(activeCart.cart_id);
        const { totalItems, totalPrice } = calculateCartTotals(cartItems);

        return NextResponse.json({
            success: true,
            cart: {
                cart_id: activeCart.cart_id,
                items: cartItems,
                totalItems,
                totalPrice
            }
        });
    } catch (error) {
        console.error("Error fetching cart:", error);
        return NextResponse.json(
            { error: "Failed to fetch cart" },
            { status: 500 }
        );
    }
}

async function getCartStatus(statusName: string) {
    const [status] = await db
        .select()
        .from(cart_status)
        .where(eq(cart_status.cart_status_name, statusName))
        .limit(1);

    return status;
}

async function getActiveCart(userId: string, statusId: number) {
    const [cart] = await db
        .select()
        .from(carts)
        .where(
            and(
                eq(carts.user_id, userId),
                eq(carts.cart_status_id, statusId)
            )
        )
        .limit(1);

    return cart;
}

async function getCartItems(cartId: number) {
    return await db
        .select({
            cart_products_id: cart_products.cart_products_id,
            cart_id: cart_products.cart_id,
            product_id: cart_products.product_id,
            quantity: cart_products.quantity,
            product_name: products.product_name,
            product_price: products.product_price,
            product_category: products.product_category,
            product_desc: products.product_desc,
            stock: products.stock,
            bonsai_size: products.bonsai_size,
            bonsai_category: products.bonsai_category,
            bonsai_age: products.bonsai_age,
            bonsai_care_level: products.bonsai_care_level,
            product_image_url: imageKit_productFiles.product_image_url,
            product_image_id: imageKit_productFiles.product_image_id,
        })
        .from(cart_products)
        .innerJoin(products, eq(cart_products.product_id, products.product_id))
        .leftJoin(
            imageKit_productFiles, 
            eq(products.imageKit_productFiles_id, imageKit_productFiles.id)
        )
        .where(eq(cart_products.cart_id, cartId));
}

function calculateCartTotals(cartItems: any[]) {
    const totalItems = cartItems.reduce(
        (sum, item) => sum + Number(item.quantity), 
        0
    );
    
    const totalPrice = cartItems.reduce(
        (sum, item) => sum + (Number(item.product_price) * Number(item.quantity)), 
        0
    );

    return {
        totalItems,
        totalPrice: Number(totalPrice.toFixed(2))
    };
}

function createEmptyCart() {
    return {
        cart_id: null,
        items: [],
        totalItems: 0,
        totalPrice: 0
    };
}