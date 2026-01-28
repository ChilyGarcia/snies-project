import { requireApiUrl } from "@/shared/config/api";
import { ApiValidationError } from "@/shared/api/api-errors";
import { getToken } from "@/shared/utils/storage";
import type {
  ContinuingEducationBeneficiary,
  CreateContinuingEducationBeneficiaryInput,
} from "@/modules/courses/types/continuing-education-beneficiary";

export type ContinuingEducationBeneficiaryCreateResponse = {
  id: number;
  message: string;
};

function authHeaders() {
  const token = getToken();
  if (!token) throw new Error("No hay token de autenticación");
  return { Authorization: `Bearer ${token}` };
}

export async function listContinuingEducationBeneficiaries(params: {
  year?: string;
  semester?: number;
}): Promise<ContinuingEducationBeneficiary[]> {
  const { year, semester } = params;

  const qs = new URLSearchParams();
  if (year) qs.set("year", year);
  if (typeof semester === "number") qs.set("semester", String(semester));
  const suffix = qs.toString() ? `?${qs.toString()}` : "";

  const res = await fetch(
    `${requireApiUrl()}/api/continuing_education_beneficiaries/list/${suffix}`,
    { headers: { ...authHeaders() } }
  );

  if (res.status === 401) throw new Error("No autenticado");
  if (res.status === 403) throw new Error("No autorizado");
  if (!res.ok) throw new Error("No se pudieron cargar beneficiarios");

  return await res.json();
}

export async function createContinuingEducationBeneficiary(
  input: CreateContinuingEducationBeneficiaryInput
): Promise<ContinuingEducationBeneficiaryCreateResponse> {
  const res = await fetch(`${requireApiUrl()}/api/continuing_education_beneficiaries/create/`, {
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
    let msg = "No se pudo crear el beneficiario";
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

export async function getContinuingEducationBeneficiary(
  id: number
): Promise<ContinuingEducationBeneficiary> {
  const res = await fetch(`${requireApiUrl()}/api/continuing_education_beneficiaries/${id}/`, {
    headers: { ...authHeaders() },
  });

  if (res.status === 401) throw new Error("No autenticado");
  if (res.status === 403) throw new Error("No autorizado");
  if (res.status === 404) throw new Error("No encontrado");
  if (!res.ok) throw new Error("No se pudo obtener el beneficiario");

  return await res.json();
}

export async function updateContinuingEducationBeneficiary(
  id: number,
  input: CreateContinuingEducationBeneficiaryInput
): Promise<ContinuingEducationBeneficiary> {
  const res = await fetch(`${requireApiUrl()}/api/continuing_education_beneficiaries/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(input),
  });

  if (res.status === 401) throw new Error("No autenticado");
  if (res.status === 403) throw new Error("No autorizado");
  if (res.status === 404) throw new Error("No encontrado");

  if (!res.ok) {
    let msg = "No se pudo actualizar el beneficiario";
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

export async function deleteContinuingEducationBeneficiary(id: number): Promise<void> {
  const res = await fetch(`${requireApiUrl()}/api/continuing_education_beneficiaries/${id}/`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });

  if (res.status === 401) throw new Error("No autenticado");
  if (res.status === 403) throw new Error("No autorizado");
  if (res.status === 404) throw new Error("No encontrado");
  if (!res.ok) throw new Error("No se pudo eliminar el beneficiario");
}

