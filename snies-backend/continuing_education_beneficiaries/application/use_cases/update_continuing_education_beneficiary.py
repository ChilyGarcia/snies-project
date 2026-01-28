from continuing_education_beneficiaries.domain.entities.continuing_education_beneficiary import (
    ContinuingEducationBeneficiary,
)
from continuing_education_beneficiaries.domain.exceptions.continuing_education_beneficiary_exception import (
    ContinuingEducationBeneficiaryNotFoundException,
)
from continuing_education_beneficiaries.domain.ports.continuing_education_beneficiary_repository import (
    ContinuingEducationBeneficiaryRepository,
)


class UpdateContinuingEducationBeneficiaryUseCase:
    def __init__(self, repository: ContinuingEducationBeneficiaryRepository):
        self.repository = repository

    def execute(
        self, beneficiary_id: int, beneficiary: ContinuingEducationBeneficiary
    ) -> ContinuingEducationBeneficiary:
        existing = self.repository.get_by_id(beneficiary_id)
        if not existing:
            raise ContinuingEducationBeneficiaryNotFoundException("Beneficiary not found")

        beneficiary_to_update = ContinuingEducationBeneficiary(
            id=beneficiary_id,
            year=beneficiary.year,
            semester=beneficiary.semester,
            course_code=beneficiary.course_code,
            beneficiary_type_extension_id=beneficiary.beneficiary_type_extension_id,
            beneficiaries_count=beneficiary.beneficiaries_count,
        )
        updated = self.repository.update(beneficiary_to_update)
        if not updated:
            raise ContinuingEducationBeneficiaryNotFoundException("Beneficiary not found")
        return updated

