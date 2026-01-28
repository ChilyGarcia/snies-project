import { requireApiUrl } from "@/shared/config/api";
import { ApiValidationError } from "@/shared/api/api-errors";
import { getToken } from "@/shared/utils/storage";
import type {
  ContinuingEducationTeacher,
  CreateContinuingEducationTeacherInput,
} from "@/modules/courses/types/continuing-education-teacher";

export type ContinuingEducationTeacherCreateResponse = {
  id: number;
  message: string;
};

function authHeaders() {
  const token = getToken();
  if (!token) throw new Error("No hay token de autenticación");
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function listContinuingEducationTeachers(params: {
  year?: string;
  semester?: number;
}): Promise<ContinuingEducationTeacher[]> {
  const { year, semester } = params;

  const qs = new URLSearchParams();
  if (year) qs.set("year", year);
  if (typeof semester === "number") qs.set("semester", String(semester));
  const suffix = qs.toString() ? `?${qs.toString()}` : "";

  const res = await fetch(
    `${requireApiUrl()}/api/continuing_education_teachers/list/${suffix}`,
    { headers: { ...authHeaders() } }
  );

  if (res.status === 401) throw new Error("No autenticado");
  if (res.status === 403) throw new Error("No autorizado");
  if (!res.ok) throw new Error("No se pudieron cargar docentes");

  return await res.json();
}

export async function createContinuingEducationTeacher(
  input: CreateContinuingEducationTeacherInput
): Promise<ContinuingEducationTeacherCreateResponse> {
  const res = await fetch(`${requireApiUrl()}/api/continuing_education_teachers/create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(input),
  });

  if (res.status === 401) throw new Error("No autenticado");
  if (res.status === 403) throw new Error("No autorizado");

  if (!res.ok) {
    let msg = "No se pudo crear el docente";
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

