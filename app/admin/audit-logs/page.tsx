"use client";

import AuditLogsTable from "@/app/ui/admin/audit/AuditLogsTable";
import { DMSans, ManRope } from "@/app/ui/fonts";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, Filter, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAuditLogs,
  usePrefetchAuditLogs,
} from "@/app/lib/query/admin/audit/useAudit";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get("page")) || 1;
  const table = searchParams.get("table") || undefined;
  const action = searchParams.get("action") || undefined;

  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, isFetching } = useAuditLogs({
    page,
    limit: 50,
    table,
    action,
  });

  const prefetchAuditLogs = usePrefetchAuditLogs();

  useEffect(() => {
    if (data && page < data.pages) {
      prefetchAuditLogs({ page: page + 1, limit: 50, table, action });
    }
  }, [data, page, table, action, prefetchAuditLogs]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    params.set("page", newPage.toString());
    if (table) params.set("table", table);
    if (action) params.set("action", action);

    router.push(`/admin/audit-logs?${params.toString()}`);
  };

  const handleFilterChange = (
    filterType: "table" | "action",
    value: string
  ) => {
    const params = new URLSearchParams();
    params.set("page", "1");

    if (filterType === "table") {
      if (value && value !== "all") params.set("table", value);
      if (action) params.set("action", action);
    } else {
      if (table) params.set("table", table);
      if (value && value !== "all") params.set("action", value);
    }

    router.push(`/admin/audit-logs?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/admin/audit-logs?page=1");
    setShowFilters(false);
  };

  if (isLoading) {
    return (
      <div className={`${ManRope.className}`}>
        <div className="flex justify-between mb-6">
          <div className="flex flex-col">
            <h3 className={`${DMSans.className} text-3xl text-dark-brown`}>
              Audit Log
            </h3>
            <span className="mt-2 text-muted-foreground">
              An audit log that tracks the recent record of events.
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading audit logs...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const hasActiveFilters = table || action;

  return (
    <div className={`${ManRope.className}`}>
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="flex flex-col">
          <h3 className={`${DMSans.className} text-3xl text-dark-brown`}>
            Audit Log
          </h3>
          <span className="mt-2 text-muted-foreground">
            An audit log that tracks the recent record of events.
          </span>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-sm text-muted-foreground">
              Total Records: <span className="font-semibold">{data.total}</span>{" "}
              | Page <span className="font-semibold">{data.page}</span> of{" "}
              <span className="font-semibold">{data.pages}</span>
            </span>
            {isFetching && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                Updating...
              </div>
            )}
          </div>
        </div>

        {/* Filter Toggle Button */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
              {(table ? 1 : 0) + (action ? 1 : 0)}
            </span>
          )}
        </Button>
      </div>

      {/* Filter Section */}
      {showFilters && (
        <div className="mb-6 p-4 border rounded-lg bg-slate-50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Table</label>
              <Select
                value={table || "all"}
                onValueChange={(value) => handleFilterChange("table", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Tables" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tables</SelectItem>
                  <SelectItem value="products">Products</SelectItem>
                  <SelectItem value="orders">Orders</SelectItem>
                  <SelectItem value="refund">Refunds</SelectItem>
                  <SelectItem value="user">Users</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Action</label>
              <Select
                value={action || "all"}
                onValueChange={(value) => handleFilterChange("action", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {hasActiveFilters && (
              <div className="flex items-end">
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Active Filters Badge */}
      {hasActiveFilters && (
        <div className="mb-4 flex flex-wrap gap-2">
          {table && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              <span>
                Table: <span className="font-semibold">{table}</span>
              </span>
              <button
                onClick={() => handleFilterChange("table", "all")}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {action && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              <span>
                Action: <span className="font-semibold">{action}</span>
              </span>
              <button
                onClick={() => handleFilterChange("action", "all")}
                className="hover:bg-green-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div>
        <AuditLogsTable auditLogs={data.logs} />
      </div>

      {/* Pagination */}
      {data.pages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <div className="text-sm text-muted-foreground">
            Showing {(page - 1) * 50 + 1} to {Math.min(page * 50, data.total)}{" "}
            of {data.total} entries
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page === 1 || isFetching}
              onClick={() => handlePageChange(page - 1)}
            >
              Previous
            </Button>

            {/* Page Numbers */}
            <div className="hidden sm:flex gap-1">
              {Array.from({ length: Math.min(5, data.pages) }, (_, i) => {
                let pageNum;
                if (data.pages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= data.pages - 2) {
                  pageNum = data.pages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    onClick={() => handlePageChange(pageNum)}
                    disabled={isFetching}
                    className="w-10"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            {/* Mobile page indicator */}
            <div className="sm:hidden flex items-center px-4 py-2 border rounded bg-slate-100">
              {data.page} / {data.pages}
            </div>

            <Button
              variant="outline"
              disabled={page === data.pages || isFetching}
              onClick={() => handlePageChange(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
