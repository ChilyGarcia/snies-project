"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PaginatedAuditLogs } from "@/modules/audit/types/audit-log";
import { listAuditLogs, type AuditLogsFilters } from "@/modules/audit/api/audit.api";

export type AuditUiFilters = {
  action: string;
  module: string;
  user_email: string;
  from: string;
  to: string;
};

export function useAuditLogs(initial?: Partial<AuditLogsFilters>) {
  const [page, setPage] = useState(initial?.page ?? 1);
  const [pageSize, setPageSize] = useState(initial?.page_size ?? 50);
  const [filters, setFilters] = useState<AuditUiFilters>({
    action: "all",
    module: "all",
    user_email: "",
    from: "",
    to: "",
  });
  const [data, setData] = useState<PaginatedAuditLogs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reqId = useRef(0);

  const query: AuditLogsFilters = useMemo(() => {
    const q: AuditLogsFilters = {
      page,
      page_size: pageSize,
    };
    if (filters.action.trim() && filters.action !== "all") q.action = filters.action.trim();
    if (filters.module.trim() && filters.module !== "all") q.module = filters.module.trim();
    if (filters.user_email.trim()) q.user_email = filters.user_email.trim();
    if (filters.from.trim()) q.from = filters.from.trim();
    if (filters.to.trim()) q.to = filters.to.trim();
    return q;
  }, [page, pageSize, filters]);

  const fetchLogs = async (opts?: { silent?: boolean }) => {
    const id = ++reqId.current;
    if (!opts?.silent) setLoading(true);
    setError(null);
    try {
      const res = await listAuditLogs(query);
      if (id !== reqId.current) return;
      setData(res);
    } catch (e) {
      if (id !== reqId.current) return;
      setData(null);
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      if (id === reqId.current) setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      void fetchLogs({ silent: true });
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.page, query.page_size, query.action, query.module, query.user_email, query.from, query.to]);

  useEffect(() => {
    // initial load
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    page,
    setPage,
    pageSize,
    setPageSize,
    filters,
    setFilters,
    data,
    loading,
    error,
    refetch: fetchLogs,
  };
}

