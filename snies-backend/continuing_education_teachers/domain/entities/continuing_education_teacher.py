from continuing_education_teachers.domain.exceptions.continuing_education_teacher_exception import (
    InvalidContinuingEducationTeacherException,
)


class ContinuingEducationTeacher:
    def __init__(
        self,
        id: int | None,
        year: str,
        semester: int,
        course_code: str,
        document_type_id: int,
        document_number: str,
    ):
        self.id = id
        self.year = str(year)
        self.semester = int(semester)
        self.course_code = str(course_code)
        self.document_type_id = int(document_type_id)
        self.document_number = str(document_number)

        self._validate()

    def _validate(self):
        if not (len(self.year) == 4 and self.year.isdigit()):
            raise InvalidContinuingEducationTeacherException("Invalid year")
        if self.semester not in (1, 2):
            raise InvalidContinuingEducationTeacherException("Invalid semester")
        if not self.course_code:
            raise InvalidContinuingEducationTeacherException("Invalid course_code")
        if self.document_type_id <= 0:
            raise InvalidContinuingEducationTeacherException("Invalid document_type_id")
        if not self.document_number:
            raise InvalidContinuingEducationTeacherException("Invalid document_number")

