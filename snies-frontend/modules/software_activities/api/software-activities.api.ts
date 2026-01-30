import { requireApiUrl } from "@/shared/config/api";
import { getToken } from "@/shared/utils/storage";
import type {
  CreateSoftwareActivityInput,
  ImportSoftwareActivitiesResult,
  SoftwareActivity,
} from "@/modules/software_activities/types/software-activity";

function authHeaders() {
  const token = getToken();
  if (!token) throw new Error("No hay token de autenticación");
  return { Authorization: `Bearer ${token}` };
}

export async function listSoftwareActivities(params?: {
  limit?: number;
  offset?: number;
  career?: string;
}): Promise<SoftwareActivity[]> {
  const limit = params?.limit ?? 100;
  const offset = params?.offset ?? 0;
  const career = params?.career?.trim();
  const careerQuery = career ? `&career=${encodeURIComponent(career)}` : "";

  const res = await fetch(
    `${requireApiUrl()}/api/software_activities/?limit=${limit}&offset=${offset}${careerQuery}`,
    { method: "GET", headers: authHeaders() }
  );
  if (!res.ok) {
    let msg = "No se pudieron cargar actividades";
    try {
      const err = await res.json();
      msg = err.detail || err.message || msg;
    } catch {}
    throw new Error(msg);
  }
  return await res.json();
}

export async function createSoftwareActivity(
  input: CreateSoftwareActivityInput
): Promise<{ id: number; message?: string }> {
  const res = await fetch(`${requireApiUrl()}/api/software_activities/`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    let msg = "No se pudo crear la actividad";
    try {
      const err = await res.json();
      msg = err.detail || err.message || msg;
    } catch {}
    throw new Error(msg);
  }
  return await res.json();
}

export async function importSoftwareActivitiesExcel(file: File): Promise<ImportSoftwareActivitiesResult> {
  const fd = new FormData();
  fd.set("file", file);

  const res = await fetch(`${requireApiUrl()}/api/software_activities/import/`, {
    method: "POST",
    headers: authHeaders(),
    body: fd,
  });

  if (!res.ok) {
    let msg = "No se pudo importar el Excel";
    try {
      const err = await res.json();
      msg = err.detail || err.message || msg;
    } catch {}
    throw new Error(msg);
  }
  return await res.json();
}

export async function exportSoftwareActivitiesExcel(): Promise<Blob> {
  const res = await fetch(`${requireApiUrl()}/api/software_activities/export/`, {
    method: "GET",
    headers: authHeaders(),
  });
  if (!res.ok) {
    let msg = "No se pudo exportar el Excel";
    try {
      const err = await res.json();
      msg = err.detail || err.message || msg;
    } catch {}
    throw new Error(msg);
  }
  return await res.blob();
}

