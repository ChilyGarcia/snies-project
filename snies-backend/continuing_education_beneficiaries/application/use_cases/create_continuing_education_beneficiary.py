from continuing_education_beneficiaries.domain.entities.continuing_education_beneficiary import (
    ContinuingEducationBeneficiary,
)
from continuing_education_beneficiaries.domain.ports.continuing_education_beneficiary_repository import (
    ContinuingEducationBeneficiaryRepository,
)


class CreateContinuingEducationBeneficiaryUseCase:
    def __init__(self, repository: ContinuingEducationBeneficiaryRepository):
        self.repository = repository

    def execute(self, beneficiary: ContinuingEducationBeneficiary) -> ContinuingEducationBeneficiary:
        return self.repository.create(beneficiary)

