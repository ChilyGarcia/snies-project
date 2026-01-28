export type AuditAction = "create" | "update" | "delete" | string;

export type AuditLog = {
  id: number;
  created_at: string;
  action: AuditAction;
  method: string;
  path: string;
  status_code: number;
  user_id: number | null;
  user_email: string | null;
  user_role: string | null;
  ip: string | null;
  user_agent: string | null;
  view_name: string | null;
  module: string | null;
  resource_id: string | null;
  request_data: unknown;
  response_data: unknown;
};

export type PaginatedAuditLogs = {
  count: number;
  page: number;
  page_size: number;
  results: AuditLog[];
};

