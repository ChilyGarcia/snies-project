import { BaseApi } from "@/shared/api/base-api";
import { WellbeingBenefeciaryRepository } from "../hooks/ports/wellbeing-beneficiary.repository";
import { CreateWellbeingBeneficiaryInput } from "../hooks/types/create-beneficiary-input";
import { WellbeingBenefeciary } from "../types/beneficiary";
import { requireApiUrl } from "@/shared/config/api";
import { ApiValidationError } from "@/shared/api/api-errors";
export class WellbeingBenefeciaryApi extends BaseApi implements WellbeingBenefeciaryRepository {
    async create(input: CreateWellbeingBeneficiaryInput): Promise<WellbeingBenefeciary> {
        const token = this.getToken();
        const res = await fetch(`${requireApiUrl()}/api/wellbeing_beneficiaries/create/`, {
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
            let msg = "No se pudo crear el beneficiario";
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
        const data = await res.json();
        if (data && typeof data === "object" && "id" in data && !("year" in data)) {
            return {
                id: String((data as any).id),
                year: input.year,
                semester: input.semester,
                organization_unit_code: input.organization_unit_code,
                activity_code: input.activity_code,
                beneficiary_type_id: input.beneficiary_type_id,
                beneficiaries_count: input.beneficiaries_count,
            };
        }
        return data as WellbeingBenefeciary;
    }
    async list(): Promise<WellbeingBenefeciary[]> {
        const token = this.getToken();
        const res = await fetch(`${requireApiUrl()}/api/wellbeing_beneficiaries/list/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (res.status === 401)
            throw new Error("No autenticado");
        if (res.status === 403)
            throw new Error("No autorizado");
        if (!res.ok)
            throw new Error("No se pudieron cargar beneficiarios");
        return await res.json();
    }
    async update(id: string, input: Partial<CreateWellbeingBeneficiaryInput>): Promise<WellbeingBenefeciary> {
        const token = this.getToken();
        const res = await fetch(`${requireApiUrl()}/api/wellbeing_beneficiaries/${id}/`, {
            method: "PUT",
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
            let msg = "No se pudo actualizar beneficiario";
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
        return res.json();
    }
    async delete(id: string): Promise<void> {
        const token = this.getToken();
        const res = await fetch(`${requireApiUrl()}/api/wellbeing_beneficiaries/${id}/`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (res.status === 401)
            throw new Error("No autenticado");
        if (res.status === 403)
            throw new Error("No autorizado");
        if (!res.ok)
            throw new Error("No se pudo eliminar beneficiario");
    }
}
