import { useState } from "react";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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
  const [isUpdating, setIsUpdating] = useState(false);

  const orderStatuses = [
    { value: "Pending", label: "Pending" },
    { value: "Processing", label: "Processing" },
    { value: "Shipped", label: "Shipped" },
    { value: "Delivered", label: "Delivered" },
    { value: "Cancelled", label: "Cancelled" },
    { value: "Refunded", label: "Refunded" },
  ];

  // Update newStatus when order changes
  useState(() => {
    if (order) {
      setNewStatus(order.order_status_name);
    }
  });

  const handleStatusUpdate = async () => {
    if (!order || !newStatus) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${order.order_id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        console.log(`Order ${order.order_id} updated to ${newStatus}`);
        onSuccess?.();
        onClose();
      } else {
        const error = await response.json();
        console.error("Failed to update order status:", error);
        // You could add toast notification here
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      // You could add toast notification here
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isUpdating) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Order Status</DialogTitle>
          <DialogDescription>
            Update the status for order #{order?.order_id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="customer">Customer</Label>
            <p className="text-sm font-medium">{order?.user_name}</p>
            <p className="text-xs text-muted-foreground">{order?.user_email}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="total">Order Total</Label>
            <p className="text-sm font-medium">₱{order?.total.toFixed(2)}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment">Payment Status</Label>
            <p className="text-sm font-medium capitalize">
              {order?.payment_status || "N/A"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Order Status</Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {orderStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleStatusUpdate}
            disabled={isUpdating || newStatus === order?.order_status_name}
          >
            {isUpdating ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditOrderStatusDialog;