import { requireApiUrl } from "@/shared/config/api";
import { ApiValidationError } from "@/shared/api/api-errors";
import { getToken } from "@/shared/utils/storage";
import type { CreateContinuingEducationInput } from "@/modules/courses/hooks/types/create-continuingeducation-input";

export type ContinuingEducationCreateResponse = {
  id: number;
  message: string;
};

export type ContinuingEducationRecord = {
  id: number;
  year: string;
  semester: number;
  num_hours: number;
  id_course: number;
  value: number;
};

export async function listContinuingEducation(params?: {
  year?: string;
  semester?: number;
}): Promise<ContinuingEducationRecord[]> {
  const token = getToken();
  if (!token) throw new Error("No hay token de autenticación");

  const qs = new URLSearchParams();
  if (params?.year) qs.set("year", params.year);
  if (typeof params?.semester === "number") qs.set("semester", String(params.semester));
  const suffix = qs.toString() ? `?${qs.toString()}` : "";

  const res = await fetch(`${requireApiUrl()}/api/continuing_education/list/${suffix}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) throw new Error("No autenticado");
  if (res.status === 403) throw new Error("No autorizado");
  if (!res.ok) throw new Error("No se pudo cargar educación continua");

  return await res.json();
}

export async function createContinuingEducation(
  input: CreateContinuingEducationInput
): Promise<ContinuingEducationCreateResponse> {
  const token = getToken();
  if (!token) throw new Error("No hay token de autenticación");

  const res = await fetch(`${requireApiUrl()}/api/continuing_education/create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  if (res.status === 401) throw new Error("No autenticado");
  if (res.status === 403) throw new Error("No autorizado");

  if (!res.ok) {
    let msg = "No se pudo crear educación continua";
    try {
      const err = await res.json();
      if (err?.error && typeof err.error === "object") {
        throw new ApiValidationError(err.message || "Validation Error", err.error, res.status);
      }
      msg = err.detail || err.message || msg;
    } catch (e) {
      if (e instanceof ApiValidationError) throw e;
    }
    throw new Error(msg);
  }

  return await res.json();
}

