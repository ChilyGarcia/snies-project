from continuing_education_teachers.domain.entities.continuing_education_teacher import (
    ContinuingEducationTeacher,
)
from continuing_education_teachers.domain.exceptions.continuing_education_teacher_exception import (
    ContinuingEducationTeacherNotFoundException,
)
from continuing_education_teachers.domain.ports.continuing_education_teacher_repository import (
    ContinuingEducationTeacherRepository,
)


class UpdateContinuingEducationTeacherUseCase:
    def __init__(self, repository: ContinuingEducationTeacherRepository):
        self.repository = repository

    def execute(self, teacher_id: int, teacher: ContinuingEducationTeacher) -> ContinuingEducationTeacher:
        existing = self.repository.get_by_id(teacher_id)
        if not existing:
            raise ContinuingEducationTeacherNotFoundException("Teacher not found")
        teacher_to_update = ContinuingEducationTeacher(
            id=teacher_id,
            year=teacher.year,
            semester=teacher.semester,
            course_code=teacher.course_code,
            document_type_id=teacher.document_type_id,
            document_number=teacher.document_number,
        )
        updated = self.repository.update(teacher_to_update)
        if not updated:
            raise ContinuingEducationTeacherNotFoundException("Teacher not found")
        return updated

