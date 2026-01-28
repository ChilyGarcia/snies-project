from wellbeing_human_resources.domain.entities.wellbeing_human_resource import (
    WellbeingHumanResource,
)
from wellbeing_human_resources.domain.ports.wellbeing_human_resource_repository import (
    WellbeingHumanResourceRepository,
)


class CreateWellbeingHumanResourceUseCase:
    def __init__(self, repository: WellbeingHumanResourceRepository):
        self.repository = repository

    def execute(self, item: WellbeingHumanResource) -> WellbeingHumanResource:
        return self.repository.create(item)

