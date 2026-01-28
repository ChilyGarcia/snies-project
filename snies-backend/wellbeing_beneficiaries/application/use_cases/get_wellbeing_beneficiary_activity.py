from wellbeing_beneficiaries.domain.entities.wellbeing_beneficiary_activity import (
    WellbeingBeneficiaryActivity,
)
from wellbeing_beneficiaries.domain.ports.wellbeing_beneficiary_activity_repository import (
    WellbeingBeneficiaryActivityRepository,
)


class GetWellbeingBeneficiaryActivityUseCase:
    def __init__(self, repository: WellbeingBeneficiaryActivityRepository):
        self.repository = repository

    def execute(self, id: int) -> WellbeingBeneficiaryActivity | None:
        return self.repository.get_by_id(id)

