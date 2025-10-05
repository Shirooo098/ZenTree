"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface BuyNowButtonProps {
  productId: number;
  quantity?: number;
  className?: string;
  disabled?: boolean;
}

export default function BuyNowButton({ 
  productId, 
  quantity = 1, 
  className = "",
  disabled = false 
}: BuyNowButtonProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuyNow = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout/direct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            {
              productId,
              quantity,
            },
          ],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      if (data.success && data.order.approval_url) {
        sessionStorage.setItem("pending_order_id", data.order.order_id);
        sessionStorage.setItem("paypal_order_id", data.order.paypal_order_id);

        window.location.href = data.order.approval_url;
      } else {
        throw new Error("No PayPal approval URL received");
      }
    } catch (err: any) {
      console.error("Buy Now error:", err);
      setError(err.message || "Failed to process order");
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <Button
        onClick={handleBuyNow}
        disabled={disabled || isProcessing}
        className={`w-full bg-blue-600 hover:bg-blue-700 text-white ${className}`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Processing...
          </>
        ) : (
          <>
            <ShoppingBag className="w-4 h-4 mr-2" />
            Buy Now
          </>
        )}
      </Button>

      {error && (
        <p className="text-red-600 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}