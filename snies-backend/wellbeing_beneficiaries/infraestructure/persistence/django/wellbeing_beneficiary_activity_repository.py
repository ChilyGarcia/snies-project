from wellbeing_beneficiaries.domain.entities.wellbeing_beneficiary_activity import (
    WellbeingBeneficiaryActivity,
)
from wellbeing_beneficiaries.domain.ports.wellbeing_beneficiary_activity_repository import (
    WellbeingBeneficiaryActivityRepository,
)
from wellbeing_beneficiaries.infraestructure.persistence.django.models import (
    WellbeingBeneficiaryActivityModel,
)


class WellbeingBeneficiaryActivityRepositoryDjango(WellbeingBeneficiaryActivityRepository):
    def create(self, activity: WellbeingBeneficiaryActivity) -> WellbeingBeneficiaryActivity:
        model = WellbeingBeneficiaryActivityModel.objects.create(
            year=activity.year,
            semester=activity.semester,
            organization_unit_code=activity.organization_unit_code,
            activity_code=activity.activity_code,
            beneficiary_type_id=activity.beneficiary_type_id,
            beneficiaries_count=activity.beneficiaries_count,
        )
        return self._to_domain(model)

    def list(self) -> list[WellbeingBeneficiaryActivity]:
        return [self._to_domain(m) for m in WellbeingBeneficiaryActivityModel.objects.all()]

    def get_by_id(self, id: int) -> WellbeingBeneficiaryActivity | None:
        try:
            return self._to_domain(WellbeingBeneficiaryActivityModel.objects.get(id=id))
        except WellbeingBeneficiaryActivityModel.DoesNotExist:
            return None

    def update(
        self, id: int, activity: WellbeingBeneficiaryActivity
    ) -> WellbeingBeneficiaryActivity | None:
        try:
            model = WellbeingBeneficiaryActivityModel.objects.get(id=id)
        except WellbeingBeneficiaryActivityModel.DoesNotExist:
            return None

        model.year = activity.year
        model.semester = activity.semester
        model.organization_unit_code = activity.organization_unit_code
        model.activity_code = activity.activity_code
        model.beneficiary_type_id = activity.beneficiary_type_id
        model.beneficiaries_count = activity.beneficiaries_count
        model.save()
        return self._to_domain(model)

    def delete(self, id: int) -> bool:
        deleted, _ = WellbeingBeneficiaryActivityModel.objects.filter(id=id).delete()
        return deleted > 0

    def _to_domain(self, model: WellbeingBeneficiaryActivityModel) -> WellbeingBeneficiaryActivity:
        return WellbeingBeneficiaryActivity(
            id=model.id,
            year=model.year,
            semester=model.semester,
            organization_unit_code=model.organization_unit_code,
            activity_code=model.activity_code,
            beneficiary_type_id=model.beneficiary_type_id,
            beneficiaries_count=model.beneficiaries_count,
        )

