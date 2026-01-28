from continuing_education_teachers.domain.entities.continuing_education_teacher import (
    ContinuingEducationTeacher,
)
from continuing_education_teachers.domain.exceptions.continuing_education_teacher_exception import (
    ContinuingEducationTeacherNotFoundException,
)
from continuing_education_teachers.domain.ports.continuing_education_teacher_repository import (
    ContinuingEducationTeacherRepository,
)


class GetContinuingEducationTeacherUseCase:
    def __init__(self, repository: ContinuingEducationTeacherRepository):
        self.repository = repository

    def execute(self, teacher_id: int) -> ContinuingEducationTeacher:
        teacher = self.repository.get_by_id(teacher_id)
        if not teacher:
            raise ContinuingEducationTeacherNotFoundException("Teacher not found")
        return teacher

