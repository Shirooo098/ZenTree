import { auth } from "@/app/lib/auth";
import { db } from "@/db/drizzle";
import { cart_products, carts } from "@/db/schema";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function DELETE(request: Request) {
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

        const { cartProductId } = await request.json();

        if (!cartProductId) {
            return NextResponse.json(
                { error: "Cart product ID is required" },
                { status: 400 }
            );
        }

        const [cartProduct] = await db
            .select({
                cart_id: cart_products.cart_id,
                user_id: carts.user_id
            })
            .from(cart_products)
            .innerJoin(carts, eq(cart_products.cart_id, carts.cart_id))
            .where(eq(cart_products.cart_products_id, cartProductId))
            .limit(1);

        if (!cartProduct) {
            return NextResponse.json(
                { error: "Cart item not found" },
                { status: 404 }
            );
        }

        if (cartProduct.user_id !== session.user.id) {
            return NextResponse.json(
                { error: "Unauthorized to remove this item" },
                { status: 403 }
            );
        }

        // Delete the cart product
        await db
            .delete(cart_products)
            .where(eq(cart_products.cart_products_id, cartProductId));

        return NextResponse.json({
            success: true,
            message: "Item removed from cart"
        });

    } catch (error) {
        console.error("Error removing from cart:", error);
        return NextResponse.json(
            { error: "Failed to remove item from cart" },
            { status: 500 }
        );
    }
}