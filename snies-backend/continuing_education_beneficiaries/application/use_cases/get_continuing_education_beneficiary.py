from continuing_education_beneficiaries.domain.entities.continuing_education_beneficiary import (
    ContinuingEducationBeneficiary,
)
from continuing_education_beneficiaries.domain.exceptions.continuing_education_beneficiary_exception import (
    ContinuingEducationBeneficiaryNotFoundException,
)
from continuing_education_beneficiaries.domain.ports.continuing_education_beneficiary_repository import (
    ContinuingEducationBeneficiaryRepository,
)


class GetContinuingEducationBeneficiaryUseCase:
    def __init__(self, repository: ContinuingEducationBeneficiaryRepository):
        self.repository = repository

    def execute(self, beneficiary_id: int) -> ContinuingEducationBeneficiary:
        beneficiary = self.repository.get_by_id(beneficiary_id)
        if not beneficiary:
            raise ContinuingEducationBeneficiaryNotFoundException("Beneficiary not found")
        return beneficiary

