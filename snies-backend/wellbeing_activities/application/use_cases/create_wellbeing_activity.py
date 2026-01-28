from wellbeing_activities.domain.entities.wellbeing_activity import WellbeingActivity
from wellbeing_activities.domain.ports.wellbeing_activity_repository import (
    WellbeingActivityRepository,
)


class CreateWellbeingActivityUseCase:
    def __init__(self, repository: WellbeingActivityRepository):
        self.repository = repository

    def execute(self, activity: WellbeingActivity) -> WellbeingActivity:
        return self.repository.create(activity)

