import { auth } from "@/app/lib/auth";
import { db } from "@/db/drizzle";
import { cart_products, carts, products } from "@/db/schema";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function PATCH(request: Request) {
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

        const { cartProductId, quantity } = await request.json();

        if (!cartProductId || !quantity) {
            return NextResponse.json(
                { error: "Cart product ID and quantity are required" },
                { status: 400 }
            );
        }

        if (quantity < 1) {
            return NextResponse.json(
                { error: "Quantity must be at least 1" },
                { status: 400 }
            );
        }

        const [cartProduct] = await db
            .select({
                cart_id: cart_products.cart_id,
                product_id: cart_products.product_id,
                user_id: carts.user_id,
                stock: products.stock
            })
            .from(cart_products)
            .innerJoin(carts, eq(cart_products.cart_id, carts.cart_id))
            .innerJoin(products, eq(cart_products.product_id, products.product_id))
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
                { error: "Unauthorized to update this item" },
                { status: 403 }
            );
        }

        if (quantity > cartProduct.stock) {
            return NextResponse.json(
                { error: `Only ${cartProduct.stock} items available in stock` },
                { status: 400 }
            );
        }

        await db
            .update(cart_products)
            .set({ 
                quantity
            })
            .where(eq(cart_products.cart_products_id, cartProductId));

        return NextResponse.json({
            success: true,
            message: "Cart updated successfully",
            quantity
        });

    } catch (error) {
        console.error("Error updating cart:", error);
        return NextResponse.json(
            { error: "Failed to update cart" },
            { status: 500 }
        );
    }
}