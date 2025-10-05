import axios from "axios";

interface CartItem {
  product_id: number;
  product_name: string;
  quantity: number;
  product_price: string | number;
}

interface PayPalItem {
  name: string;
  description: string;
  quantity: string;
  unit_amount: {
    currency_code: string;
    value: string;
  };
}

async function generateAccessToken() {
  const response = await axios.post(
    `${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      auth: {
        username: process.env.PAYPAL_CLIENT_ID!,
        password: process.env.PAYPAL_SECRET!,
      },
    }
  );

  return response.data.access_token;
}

export async function createPayPalOrder(cartItems: CartItem[]) {
  const accessToken = await generateAccessToken();

  const paypalItems: PayPalItem[] = cartItems.map((item) => ({
    name: item.product_name,
    description: item.product_name,
    quantity: item.quantity.toString(),
    unit_amount: {
      currency_code: "PHP",
      value: Number(item.product_price).toFixed(2),
    },
  }));

  // Calculate total
  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.product_price) * item.quantity,
    0
  );
  const totalFormatted = total.toFixed(2);

  const response = await axios.post(
    `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
    {
      intent: "CAPTURE",
      purchase_units: [
        {
          items: paypalItems,
          amount: {
            currency_code: "PHP",
            value: totalFormatted,
            breakdown: {
              item_total: {
                currency_code: "PHP",
                value: totalFormatted,
              },
            },
          },
        },
      ],
      application_context: {
        return_url: `${process.env.BASE_URL}/checkout/complete-order`,
        cancel_url: `${process.env.BASE_URL}/checkout/cancel-order`,
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
        brand_name: "ZenTree",
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  console.log("PayPal Order Created:", response.data);

  const approvalUrl = response.data.links.find(
    (link: { rel: string }) => link.rel === "approve"
  )?.href;

  return {
    orderId: response.data.id,
    approvalUrl,
    fullResponse: response.data,
  };
}

export async function capturePayPalOrder(orderId: string) {
  const accessToken = await generateAccessToken();

  const response = await axios.post(
    `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
}