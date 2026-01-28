from wellbeing_human_resources.domain.entities.wellbeing_human_resource import (
    WellbeingHumanResource,
)
from wellbeing_human_resources.domain.ports.wellbeing_human_resource_repository import (
    WellbeingHumanResourceRepository,
)
from wellbeing_human_resources.infraestructure.persistence.django.models import (
    WellbeingHumanResourceModel,
)


class WellbeingHumanResourceRepositoryDjango(WellbeingHumanResourceRepository):
    def create(self, item: WellbeingHumanResource) -> WellbeingHumanResource:
        m = WellbeingHumanResourceModel.objects.create(
            year=item.year,
            semester=item.semester,
            activity_code=item.activity_code,
            organization_unit_code=item.organization_unit_code,
            document_type_id=item.document_type_id,
            document_number=item.document_number,
            dedication=item.dedication,
        )
        return self._to_domain(m)

    def list(self, year: str | None = None, semester: int | None = None) -> list[WellbeingHumanResource]:
        qs = WellbeingHumanResourceModel.objects.all().order_by("id")
        if year:
            qs = qs.filter(year=str(year))
        if semester is not None:
            qs = qs.filter(semester=int(semester))
        return [self._to_domain(m) for m in qs]

    def get_by_id(self, item_id: int) -> WellbeingHumanResource | None:
        try:
            m = WellbeingHumanResourceModel.objects.get(id=item_id)
            return self._to_domain(m)
        except WellbeingHumanResourceModel.DoesNotExist:
            return None

    def update(self, item: WellbeingHumanResource) -> WellbeingHumanResource | None:
        try:
            m = WellbeingHumanResourceModel.objects.get(id=item.id)
            m.year = item.year
            m.semester = item.semester
            m.activity_code = item.activity_code
            m.organization_unit_code = item.organization_unit_code
            m.document_type_id = item.document_type_id
            m.document_number = item.document_number
            m.dedication = item.dedication
            m.save()
            return self._to_domain(m)
        except WellbeingHumanResourceModel.DoesNotExist:
            return None

    def delete(self, item_id: int) -> bool:
        try:
            m = WellbeingHumanResourceModel.objects.get(id=item_id)
            m.delete()
            return True
        except WellbeingHumanResourceModel.DoesNotExist:
            return False

    def _to_domain(self, m: WellbeingHumanResourceModel) -> WellbeingHumanResource:
        return WellbeingHumanResource(
            id=m.id,
            year=m.year,
            semester=m.semester,
            activity_code=m.activity_code,
            organization_unit_code=m.organization_unit_code,
            document_type_id=m.document_type_id,
            document_number=m.document_number,
            dedication=m.dedication,
        )

