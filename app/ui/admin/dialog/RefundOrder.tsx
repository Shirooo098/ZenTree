import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { RefundProps } from "../refund/RefundTable";
import { useUpdateRefundStatus } from "@/app/lib/query/admin/refunds/refund-data";
import { toast } from "sonner";

interface RefundDetailsDialogProps {
  refund: RefundProps | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const RefundDetailsDialog = ({
  refund,
  isOpen,
  onClose,
  onSuccess,
}: RefundDetailsDialogProps) => {
  const [selectedConditions, setSelectedConditions] = useState<
    Record<number, string>
  >({});
  const [adminNotes, setAdminNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const updateRefundStatus = useUpdateRefundStatus();

  const conditionOptions = [
    { value: "resellable", label: "Resellable" },
    { value: "defective", label: "Defective" },
    { value: "damaged", label: "Damaged" },
    { value: "dead_plant", label: "Dead Plant" },
    { value: "broken", label: "Broken" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200">
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200">
            Rejected
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleApprove = async () => {
    if (!refund) return;

    if (!refund.refund_items || refund.refund_items.length === 0) {
      toast.error("No items found in this refund");
      return;
    }

    const allConditionsSet = refund.refund_items.every(
      (item) => selectedConditions[item.refund_item_id]
    );

    if (!allConditionsSet) {
      toast.error("Please set condition for all items before approving");
      return;
    }

    updateRefundStatus.mutate(
      {
        refundId: refund.refund_id,
        status: "approved",
        admin_notes: adminNotes,
        item_conditions: selectedConditions,
      },
      {
        onSuccess: () => {
          toast.success("Refund approved successfully");
          onSuccess?.();
          onClose();

          setSelectedConditions({});
          setAdminNotes("");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to approve refund");
        },
      }
    );
  };

  const handleReject = async () => {
    if (!refund) return;

    if (!adminNotes.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    updateRefundStatus.mutate(
      {
        refundId: refund.refund_id,
        status: "rejected",
        admin_notes: adminNotes,
      },
      {
        onSuccess: () => {
          toast.success("Refund rejected successfully");
          onSuccess?.();
          onClose();

          setSelectedConditions({});
          setAdminNotes("");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to reject refund");
        },
      }
    );
  };

  const calculateTotalRefund = () => {
    if (!refund || !refund.refund_items || refund.refund_items.length === 0)
      return 0;
    return refund.refund_items.reduce(
      (total, item) => total + item.price_at_purchase * item.quantity,
      0
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isProcessing) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Refund Details #{refund?.refund_id}</span>
            {refund && getStatusBadge(refund.status)}
          </DialogTitle>
          <DialogDescription>
            Review and process refund request for Order #{refund?.order_id}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 py-4">
            {/* Customer Information */}
            <div className="border-b pb-4">
              <Label className="text-base font-semibold mb-2 block">
                Customer Information
              </Label>
              <div className="flex gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{refund?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Refund Type</p>
                  <Badge
                    variant={
                      refund?.refund_type === "full" ? "default" : "secondary"
                    }
                  >
                    {refund?.refund_type}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Request Date</p>
                  <p className="text-sm">
                    {refund && new Date(refund.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Refund Reason */}
            <div className="border-b pb-4">
              <Label className="text-base font-semibold mb-2 block">
                Refund Reason
              </Label>
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm font-medium mb-1">{refund?.reason}</p>
                {refund?.comments && (
                  <p className="text-sm text-muted-foreground">
                    {refund.comments}
                  </p>
                )}
              </div>
            </div>

            {/* Refund Items */}
            <div className="border-b pb-4">
              <Label className="text-base font-semibold mb-3 block">
                Items to Refund
              </Label>
              <div className="space-y-3">
                {refund?.refund_items && refund.refund_items.length > 0 ? (
                  refund.refund_items.map((item) => (
                    <div
                      key={item.refund_item_id}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex items-start gap-4">
                        <Package className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{item.product_name}</p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span>Qty: {item.quantity}</span>
                            <span>
                              ₱{item.price_at_purchase.toFixed(2)} each
                            </span>
                            <span className="font-medium text-foreground">
                              Total: ₱
                              {(item.price_at_purchase * item.quantity).toFixed(
                                2
                              )}
                            </span>
                          </div>

                          {/* Condition Selector - Only show for pending refunds */}
                          {refund.status === "pending" && (
                            <div className="mt-3">
                              <Label className="text-xs mb-1 block">
                                Item Condition
                              </Label>
                              <Select
                                value={
                                  selectedConditions[item.refund_item_id] || ""
                                }
                                onValueChange={(value) =>
                                  setSelectedConditions((prev) => ({
                                    ...prev,
                                    [item.refund_item_id]: value,
                                  }))
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Condition</SelectLabel>
                                    {conditionOptions.map((option) => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {/* Show existing condition for processed refunds */}
                          {refund.status !== "pending" && item.condition && (
                            <div className="mt-2">
                              <Label className="text-xs mb-1 block">
                                Condition
                              </Label>
                              <Badge variant="outline" className="text-xs">
                                {item.condition.replace("_", " ")}
                              </Badge>
                              {item.restocked && (
                                <Badge
                                  variant="outline"
                                  className="ml-2 bg-green-50 text-green-700 text-xs"
                                >
                                  Restocked
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No items to refund
                  </div>
                )}
              </div>
            </div>

            {/* Total Refund Amount */}
            <div className="border-b pb-4">
              <div className="flex justify-between items-center">
                <Label className="text-base font-semibold">
                  Total Refund Amount
                </Label>
                <p className="text-2xl font-bold">
                  ₱{calculateTotalRefund().toFixed(2)}
                </p>
              </div>
            </div>

            {/* Admin Notes */}
            <div>
              <Label className="text-base font-semibold mb-2 block">
                Admin Notes{" "}
                {refund?.status === "pending" && (
                  <span className="text-red-500">*</span>
                )}
              </Label>
              {refund?.status === "pending" ? (
                <Textarea
                  placeholder="Add notes about this refund decision..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              ) : (
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm">
                    {refund?.admin_notes || "No admin notes"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          {refund?.status === "pending" ? (
            <>
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isProcessing}
              >
                <XCircle className="w-4 h-4 mr-2" />
                {isProcessing ? "Rejecting..." : "Reject Refund"}
              </Button>
              <Button
                onClick={handleApprove}
                disabled={isProcessing}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {isProcessing ? "Approving..." : "Approve Refund"}
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RefundDetailsDialog;
