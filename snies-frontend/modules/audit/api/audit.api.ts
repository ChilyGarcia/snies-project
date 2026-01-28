import { requireApiUrl } from "@/shared/config/api";
import { getToken } from "@/shared/utils/storage";
import type { PaginatedAuditLogs } from "@/modules/audit/types/audit-log";

export type AuditLogsFilters = {
  page: number;
  page_size: number;
  action?: string;
  module?: string;
  user_email?: string;
  from?: string; // ISO
  to?: string; // ISO
};

export async function listAuditLogs(filters: AuditLogsFilters): Promise<PaginatedAuditLogs> {
  const token = getToken();
  if (!token) throw new Error("No hay token de autenticación");

  const qs = new URLSearchParams();
  qs.set("page", String(filters.page));
  qs.set("page_size", String(filters.page_size));
  if (filters.action) qs.set("action", filters.action);
  if (filters.module) qs.set("module", filters.module);
  if (filters.user_email) qs.set("user_email", filters.user_email);
  if (filters.from) qs.set("from", filters.from);
  if (filters.to) qs.set("to", filters.to);

  const res = await fetch(`${requireApiUrl()}/api/audit/logs/?${qs.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) throw new Error("No autenticado");
  if (res.status === 403) throw new Error("No autorizado (audit:view)");
  if (!res.ok) throw new Error("No se pudieron cargar las auditorías");

  return await res.json();
}

