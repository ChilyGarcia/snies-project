export type ContinuingEducationBeneficiary = {
  id: number;
  year: string;
  semester: number;
  course_code: string;
  beneficiary_type_extension_id: number;
  beneficiaries_count: number;
};

export type CreateContinuingEducationBeneficiaryInput = {
  year: string;
  semester: number;
  course_code: string;
  beneficiary_type_extension_id: number;
  beneficiaries_count: number;
};

