from wellbeing_human_resources.domain.entities.wellbeing_human_resource import (
    WellbeingHumanResource,
)
from wellbeing_human_resources.domain.ports.wellbeing_human_resource_repository import (
    WellbeingHumanResourceRepository,
)


class ListWellbeingHumanResourcesUseCase:
    def __init__(self, repository: WellbeingHumanResourceRepository):
        self.repository = repository

    def execute(self, year: str | None = None, semester: int | None = None) -> list[WellbeingHumanResource]:
        return self.repository.list(year=year, semester=semester)

