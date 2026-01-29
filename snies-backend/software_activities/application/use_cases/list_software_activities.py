from software_activities.domain.entities.software_activity import SoftwareActivity
from software_activities.domain.ports.software_activity_repository import (
    SoftwareActivityRepository,
)


class ListSoftwareActivitiesUseCase:
    def __init__(self, repository: SoftwareActivityRepository):
        self.repository = repository

    def execute(self, limit: int = 100, offset: int = 0) -> list[SoftwareActivity]:
        return self.repository.list(limit=limit, offset=offset)

