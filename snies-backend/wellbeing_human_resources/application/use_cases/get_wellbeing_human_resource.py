from wellbeing_human_resources.domain.entities.wellbeing_human_resource import (
    WellbeingHumanResource,
)
from wellbeing_human_resources.domain.exceptions.wellbeing_human_resource_exception import (
    WellbeingHumanResourceNotFoundException,
)
from wellbeing_human_resources.domain.ports.wellbeing_human_resource_repository import (
    WellbeingHumanResourceRepository,
)


class GetWellbeingHumanResourceUseCase:
    def __init__(self, repository: WellbeingHumanResourceRepository):
        self.repository = repository

    def execute(self, item_id: int) -> WellbeingHumanResource:
        item = self.repository.get_by_id(item_id)
        if not item:
            raise WellbeingHumanResourceNotFoundException("Human resource not found")
        return item

