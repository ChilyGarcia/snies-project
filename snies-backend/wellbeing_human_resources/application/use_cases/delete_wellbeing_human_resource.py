from wellbeing_human_resources.domain.exceptions.wellbeing_human_resource_exception import (
    WellbeingHumanResourceNotFoundException,
)
from wellbeing_human_resources.domain.ports.wellbeing_human_resource_repository import (
    WellbeingHumanResourceRepository,
)


class DeleteWellbeingHumanResourceUseCase:
    def __init__(self, repository: WellbeingHumanResourceRepository):
        self.repository = repository

    def execute(self, item_id: int) -> None:
        ok = self.repository.delete(item_id)
        if not ok:
            raise WellbeingHumanResourceNotFoundException("Human resource not found")

