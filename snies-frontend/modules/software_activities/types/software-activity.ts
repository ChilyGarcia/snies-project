export type BeneficiaryBreakdown = {
  population: string;
  campus: string;
  program: string;
  level: string;
  count: number;
};

export type SoftwareActivity = {
  id: number;
  career: string | null;
  year: number;
  semester: number;
  start_date: string | null;
  end_date: string | null;
  execution_place: string;
  campus: string;
  activity_name: string;
  agreement_entity: string | null;
  description: string | null;
  cine_isced_name: string | null;
  cine_field_detailed_id: string | null;
  num_hours: number | null;
  activity_type: string | null;
  course_value: string | null;
  teacher_document_type: string | null;
  teacher_document_number: string | null;
  total_beneficiaries: number | null;
  professors_count: number | null;
  administrative_count: number | null;
  external_people_count: number | null;
  speaker_full_name: string | null;
  speaker_origin: string | null;
  speaker_company: string | null;
  consultancy_entity_name: string | null;
  consultancy_sector_id: string | null;
  consultancy_value: string | null;
  evidence_event_planning: boolean;
  evidence_event_planning_file?: string | null;
  evidence_attendance_control: boolean;
  evidence_attendance_control_file?: string | null;
  evidence_program_design_guide: boolean;
  evidence_program_design_guide_file?: string | null;
  evidence_audiovisual_record: boolean;
  evidence_audiovisual_record_file?: string | null;
  created_at: string;
  beneficiary_breakdowns?: BeneficiaryBreakdown[];
};

export type CreateSoftwareActivityInput = {
  career?: string | null;
  year: number;
  semester: number;
  start_date?: string | null;
  end_date?: string | null;
  execution_place: string;
  campus: string;
  activity_name: string;
  agreement_entity?: string | null;
  description?: string | null;
  cine_isced_name?: string | null;
  cine_field_detailed_id?: string | null;
  num_hours?: number | null;
  activity_type?: string | null;
  course_value?: number | null;
  teacher_document_type?: string | null;
  teacher_document_number?: string | null;
  total_beneficiaries?: number | null;
  professors_count?: number | null;
  administrative_count?: number | null;
  external_people_count?: number | null;
  speaker_full_name?: string | null;
  speaker_origin?: string | null;
  speaker_company?: string | null;
  consultancy_entity_name?: string | null;
  consultancy_sector_id?: string | null;
  consultancy_value?: number | null;
  evidence_event_planning?: boolean;
  evidence_attendance_control?: boolean;
  evidence_program_design_guide?: boolean;
  evidence_audiovisual_record?: boolean;
  beneficiary_breakdowns?: BeneficiaryBreakdown[];
};

export type ImportSoftwareActivitiesResult = {
  created: number;
  skipped_empty_rows: number;
};

