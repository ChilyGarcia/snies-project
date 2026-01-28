from continuing_education_teachers.domain.entities.continuing_education_teacher import (
    ContinuingEducationTeacher,
)
from continuing_education_teachers.domain.ports.continuing_education_teacher_repository import (
    ContinuingEducationTeacherRepository,
)


class ListContinuingEducationTeachersUseCase:
    def __init__(self, repository: ContinuingEducationTeacherRepository):
        self.repository = repository

    def execute(self, year: str | None = None, semester: int | None = None) -> list[ContinuingEducationTeacher]:
        return self.repository.list(year=year, semester=semester)

