export type ContinuingEducationTeacher = {
  id: number;
  year: string;
  semester: number;
  course_code: string;
  document_type_id: number;
  document_number: string;
};

export type CreateContinuingEducationTeacherInput = {
  year: string;
  semester: number;
  course_code: string;
  document_type_id: number;
  document_number: string;
};

