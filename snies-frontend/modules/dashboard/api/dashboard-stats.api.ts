import { requireApiUrl } from "@/shared/config/api";
import { getToken } from "@/shared/utils/storage";
import type { DashboardStatsResponse } from "@/modules/dashboard/types/dashboard-stats";

export async function getDashboardStats(params: {
  year?: string;
  semester?: number;
  topN?: number;
}): Promise<DashboardStatsResponse> {
  const token = getToken();
  if (!token) throw new Error("No hay token de autenticación");

  const qs = new URLSearchParams();
  if (params.year) qs.set("year", params.year);
  if (typeof params.semester === "number") qs.set("semester", String(params.semester));
  qs.set("top_n", String(params.topN ?? 10));

  const res = await fetch(`${requireApiUrl()}/api/stats/dashboard/?${qs.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) throw new Error("No autenticado");
  if (res.status === 403) throw new Error("No autorizado (solo root)");
  if (!res.ok) throw new Error("No se pudieron cargar las estadísticas del dashboard");

  return await res.json();
}

