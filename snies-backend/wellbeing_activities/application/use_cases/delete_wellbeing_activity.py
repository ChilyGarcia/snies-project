from wellbeing_activities.domain.ports.wellbeing_activity_repository import (
    WellbeingActivityRepository,
)


class DeleteWellbeingActivityUseCase:
    def __init__(self, repository: WellbeingActivityRepository):
        self.repository = repository

    def execute(self, id: int) -> bool:
        return self.repository.delete(id)

