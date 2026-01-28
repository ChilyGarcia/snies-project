import { requireApiUrl } from "@/shared/config/api";
import { getToken } from "@/shared/utils/storage";
import type { PaginatedNotifications } from "@/modules/notifications/types/notification";

export async function listNotifications(params: {
  page: number;
  page_size: number;
  is_read?: boolean;
}): Promise<PaginatedNotifications> {
  const token = getToken();
  if (!token) throw new Error("No hay token de autenticación");

  const qs = new URLSearchParams();
  qs.set("page", String(params.page));
  qs.set("page_size", String(params.page_size));
  if (typeof params.is_read === "boolean") qs.set("is_read", String(params.is_read));

  const res = await fetch(`${requireApiUrl()}/api/notifications/?${qs.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) throw new Error("No autenticado");
  if (!res.ok) throw new Error("No se pudieron cargar las notificaciones");

  return await res.json();
}

export async function getUnreadCount(): Promise<number> {
  const token = getToken();
  if (!token) throw new Error("No hay token de autenticación");

  const res = await fetch(`${requireApiUrl()}/api/notifications/unread-count/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) throw new Error("No autenticado");
  if (!res.ok) throw new Error("No se pudo obtener el contador de no leídas");

  const data = await res.json();
  return Number(data?.unread_count ?? 0);
}

export async function markNotificationRead(id: number): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("No hay token de autenticación");

  const res = await fetch(`${requireApiUrl()}/api/notifications/${id}/read/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) throw new Error("No autenticado");
  if (res.status === 404) throw new Error("La notificación no existe o no te pertenece");
  if (!res.ok) throw new Error("No se pudo marcar como leída");
}

export async function markAllNotificationsRead(): Promise<number> {
  const token = getToken();
  if (!token) throw new Error("No hay token de autenticación");

  const res = await fetch(`${requireApiUrl()}/api/notifications/read-all/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) throw new Error("No autenticado");
  if (!res.ok) throw new Error("No se pudieron marcar todas como leídas");

  const data = await res.json();
  return Number(data?.updated ?? 0);
}

