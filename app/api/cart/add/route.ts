import { auth } from "@/app/lib/auth";
import { db } from "@/db/drizzle";
import { eq, and, sql } from "drizzle-orm";
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
        let { productId } = body;
        const { quantity = 1 } = body;

        productId = Number(productId)

        if (!productId || typeof productId !== 'number') {
            return NextResponse.json(
                { error: "Invalid product ID" },
                { status: 400 }
            );
        }

        if (quantity < 1) {
            return NextResponse.json(
                { error: "Quantity must be at least 1" },
                { status: 400 }
            );
        }

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

        if(product.stock < quantity){
            return NextResponse.json(
                { error: "Insufficient stock"}, 
                { status: 400 }
            )
        }

        const newStatus = await getCartStatus('new');

        if(!newStatus) {
            return NextResponse.json(
                { error: "Cart Status Configuration error"},
                { status: 400 }
            )
        }

        const activeCart = await getOrCreateActiveCart(userId, newStatus.cart_status_id);
        const existingCartProduct = await findCartProduct(activeCart.cart_id, productId)
        
        if(existingCartProduct){
            const newQuantity = Number(existingCartProduct.quantity) + quantity;

            if(newQuantity > product.stock){
                return NextResponse.json(
                    { error: `Cannot add more items. Only ${product.stock} available in stock` },
                    { status: 400 }
                )
            }

            await updateCartProductQuantity(existingCartProduct.cart_products_id, newQuantity)
            await reduceProductStock(productId, quantity)

            return NextResponse.json({
                success: true,
                message: 'Cart updated successfully',
                cartProduct: {
                    ...existingCartProduct,
                    quantity: newQuantity
                }
            });    
        } else {
            const newCartProduct = await addProductToCart(activeCart.cart_id, productId, quantity)
            await reduceProductStock(productId, quantity)
            
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

async function getCartStatus(statusName: string){
    const [status] = await db
        .select()
        .from(cart_status)
        .where(eq(cart_status.cart_status_name, statusName))
        .limit(1);

    return status;
}

async function getOrCreateActiveCart(userId: string, statusId: number){
    let [activeCart] = await db
    .select()
    .from(carts)
    .where(
        and(
            eq(carts.user_id, userId),
            eq(carts.cart_status_id, statusId)
        ))
    .limit(1)

    if(!activeCart){
        const [newCart] = await db
            .insert(carts)
            .values({
                user_id: userId,
                cart_status_id: statusId
            })
            .returning()
        activeCart = newCart
    }

    return activeCart;
}

async function findCartProduct(cartId: number, productId: number){
      const [existingProduct] = await db
        .select()
        .from(cart_products)
        .where(
            and(
                eq(cart_products.cart_id, cartId),
                eq(cart_products.product_id, productId)
            ))
        .limit(1)
    
    return existingProduct
}

async function updateCartProductQuantity(cartProductId: number, newQuantity: number){
    await db
    .update(cart_products)
    .set({ quantity: newQuantity})
    .where(
        eq(cart_products.cart_products_id, cartProductId)
    )
}
async function addProductToCart(cartId: number, productId: number, quantity:number) {
    const [newCartProduct] = await db
        .insert(cart_products)
        .values({
            cart_id: cartId,
            product_id: productId,
            quantity,
        })
        .returning();
    
    return newCartProduct;
}

async function reduceProductStock(productId: number, quantity: number){
    await db
        .update(products)
        .set({
            stock: sql`${products.stock} - ${quantity}`

        })
        .where(eq(products.product_id, productId))
}