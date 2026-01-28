from continuing_education_beneficiaries.domain.exceptions.continuing_education_beneficiary_exception import (
    ContinuingEducationBeneficiaryNotFoundException,
)
from continuing_education_beneficiaries.domain.ports.continuing_education_beneficiary_repository import (
    ContinuingEducationBeneficiaryRepository,
)


class DeleteContinuingEducationBeneficiaryUseCase:
    def __init__(self, repository: ContinuingEducationBeneficiaryRepository):
        self.repository = repository

    def execute(self, beneficiary_id: int) -> None:
        ok = self.repository.delete(beneficiary_id)
        if not ok:
            raise ContinuingEducationBeneficiaryNotFoundException("Beneficiary not found")

