from wellbeing_activities.domain.entities.wellbeing_activity import WellbeingActivity
from wellbeing_activities.domain.ports.wellbeing_activity_repository import (
    WellbeingActivityRepository,
)


class GetWellbeingActivityUseCase:
    def __init__(self, repository: WellbeingActivityRepository):
        self.repository = repository

    def execute(self, id: int) -> WellbeingActivity | None:
        return self.repository.get_by_id(id)

