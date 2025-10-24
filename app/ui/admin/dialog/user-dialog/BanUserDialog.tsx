"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ban, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { banUser } from "@/app/actions/users.action";

type UserData = {
  id: string;
  name: string;
  email: string;
  banned: boolean | null;
};

type BanUserDialogProps = {
  user: UserData | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const BanUserDialog = ({
  user,
  isOpen,
  onClose,
  onSuccess,
}: BanUserDialogProps) => {
  const [banReason, setBanReason] = useState("");
  const [banDuration, setBanDuration] = useState("7");
  const [isLoading, setIsLoading] = useState(false);

  const handleBan = async () => {
    if (!user || !banReason.trim()) {
      toast.error("Please provide a ban reason");
      return;
    }

    setIsLoading(true);
    try {
      const daysInSeconds = parseInt(banDuration) * 60 * 60 * 24;

      const result = await banUser(user.id, banReason, daysInSeconds);

      if (result.success) {
        toast.success(result.message || "User banned successfully");
        setBanReason("");
        setBanDuration("7");
        onClose();
        onSuccess?.();
      } else {
        toast.error(result.message || "Failed to ban user");
      }
    } catch (error) {
      toast.error("An error occurred while banning the user");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setBanReason("");
      setBanDuration("7");
      onClose();
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ban className="w-5 h-5 text-red-600" />
            Ban User
          </DialogTitle>
          <DialogDescription>
            You are about to ban <strong>{user.name}</strong> ({user.email}).
            This action can be reversed later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Ban Duration */}
          <div className="space-y-2">
            <Label htmlFor="ban-duration">Ban Duration</Label>
            <Select value={banDuration} onValueChange={setBanDuration}>
              <SelectTrigger id="ban-duration">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Day</SelectItem>
                <SelectItem value="3">3 Days</SelectItem>
                <SelectItem value="7">7 Days</SelectItem>
                <SelectItem value="14">14 Days</SelectItem>
                <SelectItem value="30">30 Days</SelectItem>
                <SelectItem value="90">90 Days</SelectItem>
                <SelectItem value="365">1 Year</SelectItem>
                <SelectItem value="36500">Permanent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ban Reason */}
          <div className="space-y-2">
            <Label htmlFor="ban-reason">
              Ban Reason <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="ban-reason"
              placeholder="Enter the reason for banning this user..."
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              rows={4}
              disabled={isLoading}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              This reason will be visible to the user.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleBan}
            disabled={isLoading || !banReason.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Banning...
              </>
            ) : (
              <>
                <Ban className="w-4 h-4 mr-2" />
                Ban User
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BanUserDialog;
