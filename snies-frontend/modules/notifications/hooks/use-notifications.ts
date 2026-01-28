"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Notification, PaginatedNotifications } from "@/modules/notifications/types/notification";
import { getUnreadCount, listNotifications, markAllNotificationsRead, markNotificationRead } from "@/modules/notifications/api/notifications.api";

export type NotificationsFilter = "all" | "unread" | "read";

export function useNotifications(opts?: { pageSize?: number }) {
  const pageSize = opts?.pageSize ?? 20;
  const [filter, setFilter] = useState<NotificationsFilter>("all");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PaginatedNotifications | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingCount, setLoadingCount] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const reqId = useRef(0);

  const isReadParam = useMemo(() => {
    if (filter === "unread") return false;
    if (filter === "read") return true;
    return undefined;
  }, [filter]);

  const refreshUnreadCount = useCallback(async () => {
    try {
      setLoadingCount(true);
      const n = await getUnreadCount();
      setUnreadCount(Number.isFinite(n) ? n : 0);
    } catch {
      // no bloquear UI por contador
    } finally {
      setLoadingCount(false);
    }
  }, []);

  const refreshList = useCallback(async (params?: { silent?: boolean; resetPage?: boolean }) => {
    const id = ++reqId.current;
    try {
      if (params?.resetPage) setPage(1);
      if (!params?.silent) setLoadingList(true);
      setError(null);

      const pageToLoad = params?.resetPage ? 1 : page;
      const res = await listNotifications({ page: pageToLoad, page_size: pageSize, is_read: isReadParam });
      if (id !== reqId.current) return;
      setData(res);
    } catch (e) {
      if (id !== reqId.current) return;
      setData(null);
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      if (id === reqId.current) setLoadingList(false);
    }
  }, [isReadParam, page, pageSize]);

  const loadMore = useCallback(async () => {
    if (!data) return;
    const nextPage = data.page + 1;
    const totalPages = Math.max(1, Math.ceil((data.count ?? 0) / (data.page_size ?? pageSize)));
    if (nextPage > totalPages) return;

    const id = ++reqId.current;
    try {
      setLoadingList(true);
      const res = await listNotifications({ page: nextPage, page_size: pageSize, is_read: isReadParam });
      if (id !== reqId.current) return;
      setData({
        ...res,
        results: [...(data.results ?? []), ...(res.results ?? [])],
        page: nextPage,
      });
      setPage(nextPage);
    } catch (e) {
      if (id !== reqId.current) return;
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      if (id === reqId.current) setLoadingList(false);
    }
  }, [data, isReadParam, pageSize]);

  const markRead = useCallback(async (id: number) => {
    await markNotificationRead(id);
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        results: prev.results.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      };
    });
    setUnreadCount((c) => Math.max(0, c - 1));
  }, []);

  const markAllRead = useCallback(async () => {
    const updated = await markAllNotificationsRead();
    setData((prev) => {
      if (!prev) return prev;
      return { ...prev, results: prev.results.map((n) => ({ ...n, is_read: true })) };
    });
    setUnreadCount(0);
    return updated;
  }, []);

  // Initial load
  useEffect(() => {
    refreshUnreadCount();
    refreshList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When filter changes: reset to page 1 and refetch
  useEffect(() => {
    setPage(1);
    refreshList({ resetPage: true, silent: true });
  }, [filter, refreshList]);

  return {
    filter,
    setFilter,
    page,
    pageSize,
    data,
    notifications: (data?.results ?? []) as Notification[],
    loadingList,
    loadingCount,
    error,
    unreadCount,
    hasUnread: unreadCount > 0,
    refreshUnreadCount,
    refreshList,
    loadMore,
    markRead,
    markAllRead,
  };
}

