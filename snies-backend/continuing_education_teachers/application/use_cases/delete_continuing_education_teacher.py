from continuing_education_teachers.domain.exceptions.continuing_education_teacher_exception import (
    ContinuingEducationTeacherNotFoundException,
)
from continuing_education_teachers.domain.ports.continuing_education_teacher_repository import (
    ContinuingEducationTeacherRepository,
)


class DeleteContinuingEducationTeacherUseCase:
    def __init__(self, repository: ContinuingEducationTeacherRepository):
        self.repository = repository

    def execute(self, teacher_id: int) -> None:
        ok = self.repository.delete(teacher_id)
        if not ok:
            raise ContinuingEducationTeacherNotFoundException("Teacher not found")

