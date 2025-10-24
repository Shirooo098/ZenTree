import { AuditLogsResponse, AuditLogWithUser } from "@/app/types/audit";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface FetchAuditLogsParams {
  page?: number;
  limit?: number;
  table?: string;
  action?: string;
}

 async function fetchAuditLogs(
  params: FetchAuditLogsParams = {}
): Promise<AuditLogsResponse> {
  const { page = 1, limit = 50, table, action } = params;

  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (table) searchParams.append('table', table);
  if (action) searchParams.append('action', action);

  const response = await fetch(`/api/admin/audit-logs?${searchParams}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch audit logs');
  }

  return response.json();
}

async function fetchAuditLogById(id: number): Promise<AuditLogWithUser> {
  const response = await fetch(`/api/admin/audit-logs/${id}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch audit log');
  }

  return response.json();
}

interface UseAuditLogsOptions {
  page?: number;
  limit?: number;
  table?: string;
  action?: string;
}

// Query keys factory
export const auditLogsKeys = {
  all: ['audit-logs'] as const,
  lists: () => [...auditLogsKeys.all, 'list'] as const,
  list: (filters: UseAuditLogsOptions) => [...auditLogsKeys.lists(), filters] as const,
  details: () => [...auditLogsKeys.all, 'detail'] as const,
  detail: (id: number) => [...auditLogsKeys.details(), id] as const,
};

// Hook for fetching audit logs list
export function useAuditLogs(options: UseAuditLogsOptions = {}) {
  return useQuery({
    queryKey: auditLogsKeys.list(options),
    queryFn: () => fetchAuditLogs(options),
    staleTime: 30 * 1000, // 30 seconds
  });
}

// Hook for fetching a single audit log
export function useAuditLog(id: number | null) {
  return useQuery({
    queryKey: auditLogsKeys.detail(id!),
    queryFn: () => fetchAuditLogById(id!),
    enabled: id !== null, // Only run query if id is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for prefetching next page
export function usePrefetchAuditLogs() {
  const queryClient = useQueryClient();

  return (options: UseAuditLogsOptions) => {
    queryClient.prefetchQuery({
      queryKey: auditLogsKeys.list(options),
      queryFn: () => fetchAuditLogs(options),
    });
  };
}