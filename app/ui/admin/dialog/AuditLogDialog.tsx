// app/admin/audit-logs/AuditLogDetailsDialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useAuditLog } from "@/app/lib/query/admin/audit/useAudit";

interface AuditLogDetailsDialogProps {
  logId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AuditLogDetailsDialog({
  logId,
  isOpen,
  onClose,
}: AuditLogDetailsDialogProps) {
  const { data: log, isLoading } = useAuditLog(logId);

  const renderJsonData = (data: any, title: string) => {
    if (!data) return null;

    return (
      <div className="space-y-2">
        <h4 className="font-semibold text-sm">{title}</h4>
        <div className="bg-slate-50 p-3 rounded-md">
          <pre className="text-xs overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Audit Log Details</DialogTitle>
          <DialogDescription>
            Complete information about this audit log entry
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : log ? (
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Log ID</p>
                <p className="font-medium">{log.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Action</p>
                <Badge
                  variant={
                    log.action === "create"
                      ? "default"
                      : log.action === "update"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {log.action.toUpperCase()}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Table</p>
                <p className="font-medium">{log.table_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Record ID</p>
                <p className="font-medium">{log.record_id}</p>
              </div>
            </div>

            {/* User Info */}
            <div>
              <p className="text-sm text-muted-foreground">Performed By</p>
              <div className="mt-1">
                <p className="font-medium">{log.user_name}</p>
                <p className="text-sm text-muted-foreground">{log.user_email}</p>
              </div>
            </div>

            {/* Timestamp */}
            <div>
              <p className="text-sm text-muted-foreground">Timestamp</p>
              <p className="font-medium">
                {format(new Date(log.created_at), "PPpp")}
              </p>
            </div>

            {/* IP Address & User Agent */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">IP Address</p>
                <p className="font-mono text-sm">{log.ip_address || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">User Agent</p>
                <p className="text-xs truncate" title={log.user_agent || ""}>
                  {log.user_agent || "N/A"}
                </p>
              </div>
            </div>

            {/* Old Values */}
            {renderJsonData(log.old_values, "Old Values")}

            {/* New Values */}
            {renderJsonData(log.new_values, "New Values")}

            {/* Metadata */}
            {log.metadata && renderJsonData(log.metadata, "Additional Metadata")}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}