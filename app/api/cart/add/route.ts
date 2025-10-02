import { auth } from "@/app/lib/auth";
import { db } from "@/db/drizzle";
import { eq, and } from "drizzle-orm";
import { cart_products, cart_status, carts, products } from "@/db/schema";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if(!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401}
            )
        }

        const userId = session.user.id;
        const body = await req.json();
        const { productId, quantity = 1 } = body;

        const [product] = await db
            .select()
            .from(products)
            .where(eq(products.product_id, productId))
            .limit(1)
        
        if(!product) {
            return NextResponse.json(
                { error: "Product not found"},
                { status: 404 }
            )
        }

        if(product < quantity){
            return NextResponse.json(
                { error: "Insufficient stock"}, 
                { status: 400 }
            )
        }

        const [newStatus] = await db
            .select()
            .from(cart_status)
            .where(eq(cart_status.cart_status_name, 'new'))
            .limit(1);

        if(!newStatus) {
            return NextResponse.json(
                { error: "Cart Status Configuration error"},
                { status: 400 }
            )
        }
        let [activeCart] = await db
            .select()
            .from(carts)
            .where(
                and(
                    eq(carts.user_id, userId),
                    eq(carts.cart_status_id, newStatus.cart_status_id)
                ))
            .limit(1)

        if(!activeCart){
            const [newCart] = await db
                .insert(carts)
                .values({
                    user_id: userId,
                    cart_status_id: newStatus.cart_status_id
                })
                .returning()

            activeCart = newCart
        }

        const [existingCartProduct] = await db
            .select()
            .from(cart_products)
            .where(
                and(
                    eq(cart_products.cart_id, activeCart.cart_id),
                    eq(cart_products.product_id, productId)
                ))
            .limit(1)
        
        if(existingCartProduct){
            const newQuantity = existingCartProduct.quantity + quantity;

            if(newQuantity > product.stock){
                return NextResponse.json(
                    { error: "Cannot add more items than available stock." },
                    { status: 400 }
                )
            }

            await db
                .update(cart_products)
                .set({ quantity: newQuantity})
                .where(
                    eq(cart_products.cart_products_id, existingCartProduct.cart_products_id)
                )
            return NextResponse.json({
                success: true,
                message: 'Cart updated successfully',
                cartProduct: {
                    ...existingCartProduct,
                    quantity: newQuantity
                }
            });    
        } else {
            const [newCartProduct] = await db
                .insert(cart_products)
                .values({
                    cart_id: activeCart.cart_id,
                    product_id: productId,
                    quantity,
                })
                .returning();

            return NextResponse.json({
                success: true,
                message: 'Product added to cart successfully',
                cartProduct: newCartProduct
            });
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
        return NextResponse.json(
            { error: "Failed to add to cart"},
            { status: 500 } 
        )
    }
}