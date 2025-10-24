"use server"

import { db } from "@/db/drizzle"
import { products, audit_log } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/server/users"
import { headers } from "next/headers"

export async function deleteProduct(productId: number) {
  try {
    // Check authentication and authorization
    const session = await getCurrentUser()
    
    if (!session) {
      return { 
        success: false, 
        error: "Unauthorized - Please log in" 
      }
    }

    // ONLY ADMIN CAN DELETE
    if (session.role !== "admin") {
      return { 
        success: false, 
        error: "Forbidden - Only admins can delete products" 
      }
    }

    // Get product details before deleting (for audit log)
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.product_id, productId))
      .limit(1)

    if (!product) {
      return { 
        success: false, 
        error: "Product not found" 
      }
    }

    // Or hard delete (permanent removal - uncomment if preferred)
    await db.delete(products).where(eq(products.product_id, productId))

    // Get request metadata
    const headersList = await headers()
    const forwarded = headersList.get('x-forwarded-for')
    const ipAddress = forwarded ? forwarded.split(',')[0] : 
                      headersList.get('x-real-ip') || 'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'

    // Create audit log entry
    await db.insert(audit_log).values({
      user_id: session.id,
      action: 'delete',
      table_name: 'products',
      record_id: String(productId),
      old_values: JSON.stringify({
        product_name: product.product_name,
        product_category: product.product_category,
        product_price: product.product_price,
        stock: product.stock,
        bonsai_size: product.bonsai_size,
        bonsai_category: product.bonsai_category,
      }),
      ip_address: ipAddress,
      user_agent: userAgent,
    })

    revalidatePath("/admin/products")
    
    return { 
      success: true, 
      message: "Product deleted successfully" 
    }

  } catch (error) {
    console.error("Error deleting product:", error)
    return { 
      success: false, 
      error: "Failed to delete product" 
    }
  }
}