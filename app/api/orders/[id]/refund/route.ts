import { NextResponse } from "next/server";
import { db } from "@/db/drizzle"; 
import { refund, refund_items, order_products } from "@/db/schema";
import { eq } from "drizzle-orm";
interface RefundItem {
  product_id: number;
  quantity: number;
  condition: string;
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderId = Number(id);

  const body = await req.json();
  const { user_id, email, reason, comments, refund_type = "full", refund_items: items } = body;

  if (!user_id || !email || !reason || !items || items.length === 0) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
      
    const orderProducts = await db
      .select()
      .from(order_products)
      .where(eq(order_products.order_id, orderId));

    const orderProductIds = new Set(orderProducts.map(p => p.product_id));
    
    for (const item of items as RefundItem[]) {
      if (!orderProductIds.has(item.product_id)) {
        return NextResponse.json(
          { error: `Product ${item.product_id} not found in order` },
          { status: 400 }
        );
      }

        
      const orderProduct = orderProducts.find(p => p.product_id === item.product_id);
      if (orderProduct && item.quantity > orderProduct.quantity) {
        return NextResponse.json(
          { error: `Refund quantity exceeds ordered quantity for product ${item.product_id}` },
          { status: 400 }
        );
      }
    }

      
    const [newRefund] = await db.insert(refund).values({
      order_id: orderId,
      user_id,
      email,
      reason,
      comments: comments || null,
      refund_type,
      status: "pending",
    }).returning();

      
    const refundItemsData = await Promise.all(
      (items as RefundItem[]).map(async (item) => {
        const orderProduct = orderProducts.find(p => p.product_id === item.product_id);
        
        return db.insert(refund_items).values({
          refund_id: newRefund.refund_id,
          product_id: item.product_id,
          quantity: item.quantity,
          condition: item.condition,
          restocked: false,
        }).returning();
      })
    );

    return NextResponse.json({
      refund: newRefund,
      items: refundItemsData.flat(),
      message: "Refund request submitted successfully"
    }, { status: 201 });

  } catch (err) {
    console.error("Refund creation error:", err);
    return NextResponse.json(
      { error: "Failed to submit refund request" },
      { status: 500 }
    );
  }
}