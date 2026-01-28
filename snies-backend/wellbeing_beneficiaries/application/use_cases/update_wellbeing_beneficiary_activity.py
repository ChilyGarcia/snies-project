from wellbeing_beneficiaries.domain.entities.wellbeing_beneficiary_activity import (
    WellbeingBeneficiaryActivity,
)
from wellbeing_beneficiaries.domain.ports.wellbeing_beneficiary_activity_repository import (
    WellbeingBeneficiaryActivityRepository,
)


class UpdateWellbeingBeneficiaryActivityUseCase:
    def __init__(self, repository: WellbeingBeneficiaryActivityRepository):
        self.repository = repository

    def execute(
        self, id: int, activity: WellbeingBeneficiaryActivity
    ) -> WellbeingBeneficiaryActivity | None:
        return self.repository.update(id, activity)

