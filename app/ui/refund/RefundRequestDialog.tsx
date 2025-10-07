import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Package, AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Order } from "@/app/types/definition";

interface RefundRequestDialogProps {
  order: Order | null;
  userEmail: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface RefundItem {
  product_id: number;
  quantity: number;
  condition: string;
}

const RefundRequestDialog = ({
  order,
  userEmail,
  isOpen,
  onClose,
  onSuccess,
}: RefundRequestDialogProps) => {
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [itemConditions, setItemConditions] = useState<Record<number, string>>({});
  const [itemQuantities, setItemQuantities] = useState<Record<number, number>>({});
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const conditionOptions = [
    { value: "resellable", label: "Resellable - Item in good condition" },
    { value: "defective", label: "Defective - Item doesn't work properly" },
    { value: "damaged", label: "Damaged - Item has physical damage" },
    { value: "dead_plant", label: "Dead Plant - Plant arrived dead/dying" },
    { value: "broken", label: "Broken - Item is broken/unusable" },
  ];

  const refundReasons = [
    "Wrong item received",
    "Item arrived damaged",
    "Item is defective",
    "Plant arrived dead/dying",
    "Order didn't arrive",
    "Changed my mind",
    "Quality not as expected",
    "Other",
  ];

  useEffect(() => {
    if (order) {
      setSelectedItems(new Set());
      setItemConditions({});
      setItemQuantities({});
      setReason("");
      setComments("");
    }
  }, [order]);

  const handleItemToggle = (productId: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
      const newConditions = { ...itemConditions };
      const newQuantities = { ...itemQuantities };
      delete newConditions[productId];
      delete newQuantities[productId];
      setItemConditions(newConditions);
      setItemQuantities(newQuantities);
    } else {
      newSelected.add(productId);
      // Default to full quantity
      const product = order?.products.find(p => p.product_id === productId);
      if (product) {
        setItemQuantities(prev => ({ ...prev, [productId]: product.quantity }));
      }
    }
    setSelectedItems(newSelected);
  };

  const handleConditionChange = (productId: number, condition: string) => {
    setItemConditions(prev => ({ ...prev, [productId]: condition }));
  };

  const handleQuantityChange = (productId: number, quantity: number) => {
    setItemQuantities(prev => ({ ...prev, [productId]: quantity }));
  };

  const calculateRefundTotal = () => {
    if (!order) return 0;
    let total = 0;
    selectedItems.forEach(productId => {
      const product = order.products.find(p => p.product_id === productId);
      if (product) {
        const quantity = itemQuantities[productId] || product.quantity;
        const price = product.price_at_purchase || product.price || 0;
        total += price * quantity;
      }
    });
    return total;
  };

  const handleSubmit = async () => {
    if (!order) {
      toast.error("Order information is missing");
      return;
    }

    if (selectedItems.size === 0) {
      toast.error("Please select at least one item to refund");
      return;
    }

    // Validate all selected items have conditions
    const allHaveConditions = Array.from(selectedItems).every(
      productId => itemConditions[productId]
    );

    if (!allHaveConditions) {
      toast.error("Please select condition for all selected items");
      return;
    }

    if (!reason) {
      toast.error("Please select a reason for refund");
      return;
    }

    if (!userEmail) {
      toast.error("Email is required");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare refund items data
      const refundItems: RefundItem[] = Array.from(selectedItems).map(productId => {
        const product = order.products.find(p => p.product_id === productId);
        return {
          product_id: productId,
          quantity: itemQuantities[productId] || product!.quantity,
          condition: itemConditions[productId],
        };
      });

      const isFullRefund = selectedItems.size === order.products.length &&
        order.products.every(p => {
          const refundQty = itemQuantities[p.product_id] || p.quantity;
          return refundQty === p.quantity;
        });

      const payload = {
        user_id: order.user_id,
        email: userEmail,
        reason: reason,
        comments: comments || "",
        refund_type: isFullRefund ? "full" : "partial",
        refund_items: refundItems,
      };

      console.log("📤 Sending refund request:", payload);

      const response = await fetch(`/api/orders/${order.order_id}/refund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("📥 Response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit refund");
      }

      toast.success("Refund request submitted successfully!");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("❌ Refund submission error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit refund request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Request Refund</DialogTitle>
          <DialogDescription>
            Submit a refund request for Order #{order?.order_id}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 py-4">
            {/* Select Items Section */}
            <div>
              <Label className="text-base font-semibold mb-3 block">
                Select Items to Refund <span className="text-red-500">*</span>
              </Label>
              <div className="space-y-3">
                {order?.products.map((product) => (
                  <div
                    key={product.product_id}
                    className={`border rounded-lg p-4 transition-all ${
                      selectedItems.has(product.product_id)
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={selectedItems.has(product.product_id)}
                        onCheckedChange={() => handleItemToggle(product.product_id)}
                        className="mt-1"
                      />
                      <Package className="w-10 h-10 text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">{product.product_name}</p>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                          <span>₱{(product.price_at_purchase || product.price || 0).toFixed(2)} each</span>
                          <span>•</span>
                          <span>Available: {product.quantity}</span>
                        </div>

                        {selectedItems.has(product.product_id) && (
                          <div className="mt-4 space-y-3">
                            {/* Quantity Selector */}
                            <div>
                              <Label className="text-sm mb-2 block">Quantity to Refund</Label>
                              <Select
                                value={String(itemQuantities[product.product_id] || product.quantity)}
                                onValueChange={(value) => handleQuantityChange(product.product_id, Number(value))}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    {Array.from({ length: product.quantity }, (_, i) => i + 1).map(qty => (
                                      <SelectItem key={qty} value={String(qty)}>
                                        {qty} {qty === 1 ? 'item' : 'items'}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Condition Selector */}
                            <div>
                              <Label className="text-sm mb-2 block">
                                Item Condition <span className="text-red-500">*</span>
                              </Label>
                              <Select
                                value={itemConditions[product.product_id] || ""}
                                onValueChange={(value) => handleConditionChange(product.product_id, value)}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Choose the item&apos;s condition</SelectLabel>
                                    {conditionOptions.map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Subtotal for this item */}
                            <div className="flex justify-between items-center pt-2 border-t">
                              <span className="text-sm text-gray-600">Refund for this item:</span>
                              <span className="font-semibold text-green-600">
                                ₱{((product.price_at_purchase || product.price || 0) * (itemQuantities[product.product_id] || product.quantity)).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Refund Amount */}
            {selectedItems.size > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-green-500">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total Refund Amount:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ₱{calculateRefundTotal().toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {selectedItems.size} {selectedItems.size === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Your Email <span className="text-red-500">*</span>
              </Label>
              <input
                type="email"
                value={userEmail}
                readOnly
                className="w-full border rounded-lg px-3 py-2 bg-gray-50 text-gray-700"
              />
            </div>

            {/* Reason */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Reason for Refund <span className="text-red-500">*</span>
              </Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select your reason</SelectLabel>
                    {refundReasons.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Comments */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Additional Comments (Optional)
              </Label>
              <Textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Please provide any additional details about your refund request..."
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Info Alert */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Refund Process Information</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Your refund request will be reviewed by our team</li>
                  <li>You&apos;ll receive an email update within 2-3 business days</li>
                  <li>Approved refunds are processed within 5-7 business days</li>
                </ul>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || selectedItems.size === 0}
            className="bg-red-600 hover:bg-red-700"
          >
            {isSubmitting ? "Submitting..." : "Submit Refund Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RefundRequestDialog;