"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import TableUI from "@/components/ui/table-ui";
import { Badge } from "@/components/ui/badge";
import { AuditLogWithUser } from "@/app/types/audit";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuditLogDetailsDialog } from "../dialog/AuditLogDialog";

interface AuditLogsTableProps {
  auditLogs: AuditLogWithUser[];
}

const AuditLogsTable = ({ auditLogs }: AuditLogsTableProps) => {
  const [selectedLogId, setSelectedLogId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const tableHeads = [
    "Log ID",
    "User",
    "Action",
    "Table",
    "Record ID",
    "IP Address",
    "Timestamp",
    "Details",
  ];

  const getActionBadge = (action: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      create: "default",
      update: "secondary",
      delete: "destructive",
    };

    return (
      <Badge variant={variants[action] || "default"}>
        {action.toUpperCase()}
      </Badge>
    );
  };

  const displayTableRow = (log: AuditLogWithUser) => (
    <TableRow key={log.id} className="h-[80px]">
      <TableCell className="font-medium">
        <span>{log.id}</span>
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">{log.user_name}</span>
          <span className="text-xs text-muted-foreground truncate max-w-[150px]">
            {log.user_email}
          </span>
        </div>
      </TableCell>
      <TableCell>{getActionBadge(log.action)}</TableCell>
      <TableCell>
        <Badge variant="outline">{log.table_name}</Badge>
      </TableCell>
      <TableCell className="font-mono text-sm">{log.record_id}</TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {log.ip_address || "N/A"}
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="text-sm">
            {format(new Date(log.created_at), "MMM dd, yyyy")}
          </span>
          <span className="text-xs text-muted-foreground">
            {format(new Date(log.created_at), "HH:mm:ss")}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedLogId(log.id);
            setIsDialogOpen(true);
          }}
          className="flex items-center gap-1"
        >
          <Eye className="h-4 w-4" />
          View
        </Button>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <div className="w-full mt-6">
        {/* Desktop View */}
        <div className="border rounded-lg hidden lg:block">
          <TableUI
            items={auditLogs}
            tableHeads={tableHeads}
            tableRow={displayTableRow}
          />
        </div>

        {/* Mobile View */}
        <div className="grid grid-cols-1 gap-4 lg:hidden">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium">{log.user_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {log.user_email}
                  </p>
                </div>
                <div className="text-right">
                  {getActionBadge(log.action)}
                  <p className="text-xs text-muted-foreground mt-1">
                    ID: {log.id}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">Table</p>
                  <Badge variant="outline" className="mt-1">
                    {log.table_name}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Record ID</p>
                  <p className="font-medium font-mono text-sm">
                    {log.record_id}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">IP Address</p>
                  <p className="text-sm">{log.ip_address || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Timestamp</p>
                  <p className="text-sm">
                    {format(new Date(log.created_at), "MMM dd, yyyy")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(log.created_at), "HH:mm:ss")}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSelectedLogId(log.id);
                  setIsDialogOpen(true);
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Details Dialog */}
      <AuditLogDetailsDialog
        logId={selectedLogId}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedLogId(null);
        }}
      />
    </>
  );
};

export default AuditLogsTable;
