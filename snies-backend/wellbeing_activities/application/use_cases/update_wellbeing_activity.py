from wellbeing_activities.domain.entities.wellbeing_activity import WellbeingActivity
from wellbeing_activities.domain.ports.wellbeing_activity_repository import (
    WellbeingActivityRepository,
)


class UpdateWellbeingActivityUseCase:
    def __init__(self, repository: WellbeingActivityRepository):
        self.repository = repository

    def execute(self, id: int, activity: WellbeingActivity) -> WellbeingActivity | None:
        return self.repository.update(id, activity)

