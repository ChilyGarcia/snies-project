export type CreateWellbeingActivityInput = {
    year: string;
    semester: number;
    organization_unit_code: string;
    activity_code: string;
    activity_description: string;
    wellbeing_activity_type_id: number;
    start_date: string;
    end_date: string;
    national_source_id: number;
    national_funding_value: string;
    funding_country_id: number;
    international_source_entity_name: string | null;
    international_funding_value: string | null;
};
