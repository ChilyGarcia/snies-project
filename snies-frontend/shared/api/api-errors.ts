export type ValidationErrors = Record<string, string[] | string>;
export class ApiValidationError extends Error {
    readonly details: Record<string, string[]>;
    readonly status?: number;
    constructor(message: string, details: ValidationErrors, status?: number) {
        super(message);
        this.name = "ApiValidationError";
        this.status = status;
        const normalized: Record<string, string[]> = {};
        for (const [key, value] of Object.entries(details ?? {})) {
            if (Array.isArray(value))
                normalized[key] = value.map(String);
            else
                normalized[key] = [String(value)];
        }
        this.details = normalized;
    }
}
export function formatValidationDetails(details: Record<string, string[]>) {
    const fieldLabels: Record<string, string> = {
        code: "Código",
        name: "Nombre",
        id_cine_field_detailed: "ID CINE (campo detallado)",
        is_extension: "Extensión",
        is_active: "Activo",
        year: "Año",
        semester: "Semestre",
        num_hours: "Número de horas",
        id_course: "Curso",
        value: "Valor",
        course_code: "Código del curso",
        document_type_id: "Tipo de documento",
        document_number: "Número de documento",
        beneficiary_type_extension_id: "Tipo de beneficiario (extensión)",
        beneficiaries_count: "Cantidad de beneficiarios",
        organization_unit_code: "Código unidad organizacional",
        activity_code: "Código de actividad",
        activity_description: "Descripción",
        wellbeing_activity_type_id: "Tipo de actividad",
        start_date: "Fecha inicio",
        end_date: "Fecha fin",
        national_source_id: "Fuente nacional",
        national_funding_value: "Valor financiación nacional",
        funding_country_id: "País financiación",
        international_source_entity_name: "Entidad fuente internacional",
        international_funding_value: "Valor financiación internacional",
        beneficiary_type_id: "Tipo de beneficiario",
        document_type_id: "Tipo de documento",
        document_number: "Número de documento",
        dedication: "Dedicación",
    };
    const lines = Object.entries(details).flatMap(([field, msgs]) => {
        const label = fieldLabels[field] ?? field;
        return msgs.map((m) => `• ${label}: ${m}`);
    });
    return lines.join("\n");
}
