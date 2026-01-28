from continuing_education.domain.entities.continuing_education import ContinuingEducation
from continuing_education.domain.ports.continuing_education_repository import (
    ContinuingEducationRepository,
)


class ListContinuingEducationUseCase:
    def __init__(self, continuing_education_repository: ContinuingEducationRepository):
        self.continuing_education_repository = continuing_education_repository

    def execute(
        self, year: str | None = None, semester: int | None = None
    ) -> list[ContinuingEducation]:
        return self.continuing_education_repository.list(year=year, semester=semester)

