// app/types/audit.ts
export interface AuditLogWithUser {
  id: number;
  user_id: string;
  user_name: string;
  user_email: string;
  action: string;
  table_name: string;
  record_id: string;
  old_values: any;
  new_values: any;
  ip_address: string | null;
  user_agent: string | null;
  metadata: any;
  created_at: Date;
}

export interface AuditLogsResponse {
  logs: AuditLogWithUser[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}