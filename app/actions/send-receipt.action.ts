"use server";

import transporter from "../lib/nodemailer";
import { Order } from "../types/definition";

const styles = {
  container: 'max-width: 600px; margin: 20px auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 8px; font-family: Arial, sans-serif; background-color: #ffffff;',
  header: 'text-align: center; color: #2d3748; margin-bottom: 30px;',
  title: 'font-size: 28px; font-weight: bold; margin: 0; color: #1a202c;',
  subtitle: 'font-size: 16px; color: #718096; margin-top: 8px;',
  section: 'margin: 25px 0; padding: 20px; background-color: #f7fafc; border-radius: 6px;',
  sectionTitle: 'font-size: 18px; font-weight: bold; color: #2d3748; margin-bottom: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;',
  detailRow: 'display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0;',
  detailLabel: 'color: #718096; font-size: 14px;',
  detailValue: 'color: #2d3748; font-weight: 600; font-size: 14px;',
  itemRow: 'display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid #e2e8f0;',
  itemName: 'font-weight: 600; color: #2d3748; font-size: 15px;',
  itemDetails: 'color: #718096; font-size: 13px; margin-top: 4px;',
  itemPrice: 'font-weight: bold; color: #2d3748; font-size: 15px;',
  totalRow: 'display: flex; justify-content: space-between; padding: 20px 0; font-size: 20px; font-weight: bold;',
  totalLabel: 'color: #2d3748;',
  totalValue: 'color: #16a34a;',
  footer: 'text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #718096; font-size: 14px;',
  button: 'display: inline-block; margin-top: 20px; padding: 12px 30px; background: #16a34a; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600;',
  statusBadge: 'display: inline-block; padding: 6px 12px; border-radius: 4px; font-size: 13px; font-weight: 600;'
};



export async function sendReceiptAction({
  to,
  orderDetails,
  userName
}: {
  to: string;
  orderDetails: Order;
  userName: string;
}) {
  const orderDate = new Date(orderDetails.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const statusColor = 
    orderDetails.order_status_name.toLowerCase() === "pending" ? "#eab308" :
    orderDetails.order_status_name.toLowerCase() === "process" ? "#0284c7" :
    orderDetails.order_status_name.toLowerCase() === "shipped" ? "#14b8a6" :
    orderDetails.order_status_name.toLowerCase() === "delivered" ? "#16a34a" :
    orderDetails.order_status_name.toLowerCase() === "completed" ? "#15803d" :
    "#dc2626";

  const itemsHtml = orderDetails.products
    .map(
      (item) => `
        <div style="${styles.itemRow}">
          <div style="flex: 1;">
            <div style="${styles.itemName}">${item.product_name}</div>
            <div style="${styles.itemDetails}">Quantity: ${item.quantity} × ₱${(item.price_at_purchase || item.price).toFixed(2)}</div>
          </div>
          <div style="${styles.itemPrice}">₱${(item.subtotal || (item.quantity * (item.price_at_purchase || item.price))).toFixed(2)}</div>
        </div>
      `
    )
    .join("");

  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to,
    subject: `ZenTree - Order Receipt #${orderDetails.order_id}`,
    html: `
      <div style="${styles.container}">
        <div style="${styles.header}">
          <h1 style="${styles.title}">Thank You For Your Order${userName ? `, ${userName}` : ''}!</h1>
          <p style="${styles.subtitle}">Your order has been confirmed and is being processed.</p>
        </div>

        <!-- Order Summary -->
        <div style="${styles.section}">
          <h2 style="${styles.sectionTitle}">Order Summary</h2>
          <div style="${styles.detailRow}">
            <span style="${styles.detailLabel}">Order Number:</span>
            <span style="${styles.detailValue}">#${orderDetails.order_id}</span>
          </div>
          <div style="${styles.detailRow}">
            <span style="${styles.detailLabel}">Order Date:</span>
            <span style="${styles.detailValue}">${orderDate}</span>
          </div>
          <div style="${styles.detailRow}">
            <span style="${styles.detailLabel}">Order Status:</span>
            <span style="${styles.statusBadge} background-color: ${statusColor}; color: white;">
              ${orderDetails.order_status_name}
            </span>
          </div>
        </div>

        <!-- Items Ordered -->
        <div style="${styles.section}">
          <h2 style="${styles.sectionTitle}">Items Ordered</h2>
          ${itemsHtml}
        </div>

        <!-- Total -->
        <div style="${styles.totalRow}">
          <span style="${styles.totalLabel}">Total:</span>
          <span style="${styles.totalValue}">₱${orderDetails.total.toFixed(2)}</span>
        </div>

        <!-- Call to Action -->
        <div style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/profile/order/${orderDetails.order_id}" style="${styles.button}">
            View Order Details
          </a>
        </div>

        <!-- Footer -->
        <div style="${styles.footer}">
          <p>If you have any questions about your order, please contact our support team.</p>
          <p style="margin-top: 10px;">Thank you for shopping with ZenTree!</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Send Receipt Action Error:", error);
    return { success: false, error };
  }
}