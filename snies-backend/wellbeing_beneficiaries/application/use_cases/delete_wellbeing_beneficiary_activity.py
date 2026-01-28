from wellbeing_beneficiaries.domain.ports.wellbeing_beneficiary_activity_repository import (
    WellbeingBeneficiaryActivityRepository,
)


class DeleteWellbeingBeneficiaryActivityUseCase:
    def __init__(self, repository: WellbeingBeneficiaryActivityRepository):
        self.repository = repository

    def execute(self, id: int) -> bool:
        return self.repository.delete(id)

