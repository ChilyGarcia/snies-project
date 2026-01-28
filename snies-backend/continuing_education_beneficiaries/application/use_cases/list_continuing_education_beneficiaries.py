from continuing_education_beneficiaries.domain.entities.continuing_education_beneficiary import (
    ContinuingEducationBeneficiary,
)
from continuing_education_beneficiaries.domain.ports.continuing_education_beneficiary_repository import (
    ContinuingEducationBeneficiaryRepository,
)


class ListContinuingEducationBeneficiariesUseCase:
    def __init__(self, repository: ContinuingEducationBeneficiaryRepository):
        self.repository = repository

    def execute(
        self, year: str | None = None, semester: int | None = None
    ) -> list[ContinuingEducationBeneficiary]:
        return self.repository.list(year=year, semester=semester)

