from continuing_education_beneficiaries.domain.entities.continuing_education_beneficiary import (
    ContinuingEducationBeneficiary,
)
from continuing_education_beneficiaries.domain.ports.continuing_education_beneficiary_repository import (
    ContinuingEducationBeneficiaryRepository,
)
from continuing_education_beneficiaries.infraestructure.persistence.django.models import (
    ContinuingEducationBeneficiaryModel,
)


class ContinuingEducationBeneficiaryRepositoryDjango(ContinuingEducationBeneficiaryRepository):
    def create(self, beneficiary: ContinuingEducationBeneficiary) -> ContinuingEducationBeneficiary:
        m = ContinuingEducationBeneficiaryModel.objects.create(
            year=beneficiary.year,
            semester=beneficiary.semester,
            course_code=beneficiary.course_code,
            beneficiary_type_extension_id=beneficiary.beneficiary_type_extension_id,
            beneficiaries_count=beneficiary.beneficiaries_count,
        )
        return self._to_domain(m)

    def list(
        self, year: str | None = None, semester: int | None = None
    ) -> list[ContinuingEducationBeneficiary]:
        qs = ContinuingEducationBeneficiaryModel.objects.all().order_by("id")
        if year:
            qs = qs.filter(year=str(year))
        if semester is not None:
            qs = qs.filter(semester=int(semester))
        return [self._to_domain(m) for m in qs]

    def get_by_id(self, beneficiary_id: int) -> ContinuingEducationBeneficiary | None:
        try:
            m = ContinuingEducationBeneficiaryModel.objects.get(id=beneficiary_id)
            return self._to_domain(m)
        except ContinuingEducationBeneficiaryModel.DoesNotExist:
            return None

    def update(self, beneficiary: ContinuingEducationBeneficiary) -> ContinuingEducationBeneficiary | None:
        try:
            m = ContinuingEducationBeneficiaryModel.objects.get(id=beneficiary.id)
            m.year = beneficiary.year
            m.semester = beneficiary.semester
            m.course_code = beneficiary.course_code
            m.beneficiary_type_extension_id = beneficiary.beneficiary_type_extension_id
            m.beneficiaries_count = beneficiary.beneficiaries_count
            m.save()
            return self._to_domain(m)
        except ContinuingEducationBeneficiaryModel.DoesNotExist:
            return None

    def delete(self, beneficiary_id: int) -> bool:
        try:
            m = ContinuingEducationBeneficiaryModel.objects.get(id=beneficiary_id)
            m.delete()
            return True
        except ContinuingEducationBeneficiaryModel.DoesNotExist:
            return False

    def _to_domain(self, m: ContinuingEducationBeneficiaryModel) -> ContinuingEducationBeneficiary:
        return ContinuingEducationBeneficiary(
            id=m.id,
            year=m.year,
            semester=m.semester,
            course_code=m.course_code,
            beneficiary_type_extension_id=m.beneficiary_type_extension_id,
            beneficiaries_count=m.beneficiaries_count,
        )

