import { useState, useEffect } from "react";
import { AdminOrder } from "@/app/types/definition";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useUpdateOrderStatus } from "@/app/lib/query/admin/orders/order-data";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image, ImageKitProvider } from "@imagekit/next";

interface EditOrderStatusDialogProps {
  order: AdminOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const EditOrderStatusDialog = ({
  order,
  isOpen,
  onClose,
  onSuccess,
}: EditOrderStatusDialogProps) => {
  const [newStatus, setNewStatus] = useState<string>(order?.order_status_name || "");
  const updateOrderStatus = useUpdateOrderStatus();
  const router = useRouter();

  const orderStatuses = [
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "refunded", label: "Refunded" },
  ];

  useEffect(() => {
    if (order) {
      setNewStatus("");
    }
  }, [order]);

  const handleStatusUpdate = async () => {
    if (!order || !newStatus) return;

    updateOrderStatus.mutate(
      { orderId: order.order_id, status: newStatus },
      {
        onSuccess: () => {
          onSuccess?.();
          onClose();
          router.push("/admin/order");
        },
      }
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !updateOrderStatus.isPending) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Order Status</DialogTitle>
          <DialogDescription>
            Update the status for order #{order?.order_id}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="customer">Customer</Label>
              <p className="text-sm text-muted-foreground">Username: {order?.user_name}</p>
              <p className="text-sm text-muted-foreground">Email: {order?.user_email}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment">Payment Status</Label>
              <p className="text-sm text-muted-foreground capitalize">
                Status: {order?.payment_status || "N/A"}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Products Ordered</Label>
              <div className="border rounded-lg divide-y">
                {order?.products.map((product, index) => (
                  <div key={index} className="p-3 flex items-start gap-3">
                    {product.product_image_url && (
                      <ImageKitProvider urlEndpoint={product.product_image_url}>
                        <Image
                        src={product.product_image_url}
                        alt={product.product_name}
                        width={50}
                        height={50}
                        className="w-16 h-16 object-cover rounded"
                      />
                      </ImageKitProvider>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {product.product_name}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span>Qty: {product.quantity}</span>
                        <span>₱{(product.price_at_purchase  || 0).toFixed(2)} each</span>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-right">
                      ₱{((product.price_at_purchase || 0) * product.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t">
              <div className="flex justify-between items-center">
                <Label className="text-base">Order Total</Label>
                <p className="text-lg font-bold">₱{order?.total.toFixed(2)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Order Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    {orderStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={updateOrderStatus.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleStatusUpdate}
            disabled={updateOrderStatus.isPending || newStatus === order?.order_status_name}
          >
            {updateOrderStatus.isPending ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditOrderStatusDialog;