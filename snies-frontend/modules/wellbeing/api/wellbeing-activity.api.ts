import { BaseApi } from "@/shared/api/base-api";
import { WellbeingActivity } from "../types/activity";
import { WellbeingActivityRepository } from "../hooks/ports/wellbeing-activity.repository";
import { CreateWellbeingActivityInput } from "../hooks/types/create-activity-input";
import { requireApiUrl } from "@/shared/config/api";
import { ApiValidationError } from "@/shared/api/api-errors";
export class WellbeingActivityApi extends BaseApi implements WellbeingActivityRepository {
    async create(input: CreateWellbeingActivityInput): Promise<WellbeingActivity> {
        const token = this.getToken();
        const res = await fetch(`${requireApiUrl()}/api/wellbeing_activities/create/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(input),
        });
        if (res.status === 401)
            throw new Error("No autenticado");
        if (res.status === 403)
            throw new Error("No autorizado");
        if (!res.ok) {
            let msg = "No se pudo crear la actividad";
            try {
                const err = await res.json();
                if (err?.error && typeof err.error === "object") {
                    throw new ApiValidationError(err.message || "Validation Error", err.error, res.status);
                }
                msg = err.detail || err.message || msg;
            }
            catch (e) {
                if (e instanceof ApiValidationError)
                    throw e;
            }
            throw new Error(msg);
        }
        return await res.json();
    }
    async list(): Promise<WellbeingActivity[]> {
        const token = this.getToken();
        const res = await fetch(`${requireApiUrl()}/api/wellbeing_activities/list/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (res.status === 401)
            throw new Error("No autenticado");
        if (res.status === 403)
            throw new Error("No autorizado");
        if (!res.ok)
            throw new Error("No se pudieron cargar actividades de bienestar");
        return await res.json();
    }
}
