from software_activities.domain.entities.software_activity import (
    SoftwareActivity,
    BeneficiaryBreakdown,
)
from software_activities.domain.ports.software_activity_repository import (
    SoftwareActivityRepository,
)


class CreateSoftwareActivityUseCase:
    def __init__(self, repository: SoftwareActivityRepository):
        self.repository = repository

    def execute(
        self,
        activity: SoftwareActivity,
        breakdowns: list[BeneficiaryBreakdown] | None = None,
    ) -> SoftwareActivity:
        return self.repository.create(activity=activity, breakdowns=breakdowns)

