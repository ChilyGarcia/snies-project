import { BaseApi } from "@/shared/api/base-api";
import { requireApiUrl } from "@/shared/config/api";
import { ApiValidationError } from "@/shared/api/api-errors";
import type { WellbeingHumanResourceRepository } from "@/modules/wellbeing/hooks/ports/wellbeing-human-resource.repository";
import type { CreateWellbeingHumanResourceInput } from "@/modules/wellbeing/hooks/types/create-human-resource-input";
import type { WellbeingHumanResource } from "@/modules/wellbeing/types/human-resource";

export class WellbeingHumanResourceApi extends BaseApi implements WellbeingHumanResourceRepository {
  async create(input: CreateWellbeingHumanResourceInput): Promise<WellbeingHumanResource> {
    const token = this.getToken();
    const res = await fetch(`${requireApiUrl()}/api/wellbeing_human_resources/create/`, {
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
      let msg = "No se pudo crear el recurso humano";
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

    const data = await res.json();
    if (data && typeof data === "object" && "id" in data && !("year" in data)) {
      return { id: String((data as any).id), ...input };
    }
    return data as WellbeingHumanResource;
  }

  async list(params?: { year?: string; semester?: number }): Promise<WellbeingHumanResource[]> {
    const token = this.getToken();
    const qs = new URLSearchParams();
    if (params?.year) qs.set("year", params.year);
    if (typeof params?.semester === "number") qs.set("semester", String(params.semester));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";

    const res = await fetch(`${requireApiUrl()}/api/wellbeing_human_resources/list/${suffix}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) throw new Error("No autenticado");
    if (res.status === 403) throw new Error("No autorizado");
    if (!res.ok) throw new Error("No se pudieron cargar recursos humanos");

    return await res.json();
  }
}

