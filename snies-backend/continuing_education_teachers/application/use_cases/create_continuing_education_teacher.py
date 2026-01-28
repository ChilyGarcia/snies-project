from continuing_education_teachers.domain.entities.continuing_education_teacher import (
    ContinuingEducationTeacher,
)
from continuing_education_teachers.domain.ports.continuing_education_teacher_repository import (
    ContinuingEducationTeacherRepository,
)


class CreateContinuingEducationTeacherUseCase:
    def __init__(self, repository: ContinuingEducationTeacherRepository):
        self.repository = repository

    def execute(self, teacher: ContinuingEducationTeacher) -> ContinuingEducationTeacher:
        return self.repository.create(teacher)

