from wellbeing_human_resources.domain.entities.wellbeing_human_resource import (
    WellbeingHumanResource,
)
from wellbeing_human_resources.domain.exceptions.wellbeing_human_resource_exception import (
    WellbeingHumanResourceNotFoundException,
)
from wellbeing_human_resources.domain.ports.wellbeing_human_resource_repository import (
    WellbeingHumanResourceRepository,
)


class UpdateWellbeingHumanResourceUseCase:
    def __init__(self, repository: WellbeingHumanResourceRepository):
        self.repository = repository

    def execute(self, item_id: int, item: WellbeingHumanResource) -> WellbeingHumanResource:
        existing = self.repository.get_by_id(item_id)
        if not existing:
            raise WellbeingHumanResourceNotFoundException("Human resource not found")

        item_to_update = WellbeingHumanResource(
            id=item_id,
            year=item.year,
            semester=item.semester,
            activity_code=item.activity_code,
            organization_unit_code=item.organization_unit_code,
            document_type_id=item.document_type_id,
            document_number=item.document_number,
            dedication=item.dedication,
        )
        updated = self.repository.update(item_to_update)
        if not updated:
            raise WellbeingHumanResourceNotFoundException("Human resource not found")
        return updated

