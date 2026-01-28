from wellbeing_activities.domain.entities.wellbeing_activity import WellbeingActivity
from wellbeing_activities.domain.ports.wellbeing_activity_repository import (
    WellbeingActivityRepository,
)
from wellbeing_activities.infraestructure.persistence.django.models import (
    WellbeingActivityModel,
)


class WellbeingActivityRepositoryDjango(WellbeingActivityRepository):
    def create(self, activity: WellbeingActivity) -> WellbeingActivity:
        model = WellbeingActivityModel.objects.create(
            year=activity.year,
            semester=activity.semester,
            organization_unit_code=activity.organization_unit_code,
            activity_code=activity.activity_code,
            activity_description=activity.activity_description,
            wellbeing_activity_type_id=activity.wellbeing_activity_type_id,
            start_date=activity.start_date,
            end_date=activity.end_date,
            national_source_id=activity.national_source_id,
            national_funding_value=activity.national_funding_value,
            funding_country_id=activity.funding_country_id,
            international_source_entity_name=activity.international_source_entity_name,
            international_funding_value=activity.international_funding_value,
        )
        return self._to_domain(model)

    def list(self) -> list[WellbeingActivity]:
        return [self._to_domain(m) for m in WellbeingActivityModel.objects.all()]

    def get_by_id(self, id: int) -> WellbeingActivity | None:
        try:
            return self._to_domain(WellbeingActivityModel.objects.get(id=id))
        except WellbeingActivityModel.DoesNotExist:
            return None

    def update(self, id: int, activity: WellbeingActivity) -> WellbeingActivity | None:
        try:
            model = WellbeingActivityModel.objects.get(id=id)
        except WellbeingActivityModel.DoesNotExist:
            return None

        model.year = activity.year
        model.semester = activity.semester
        model.organization_unit_code = activity.organization_unit_code
        model.activity_code = activity.activity_code
        model.activity_description = activity.activity_description
        model.wellbeing_activity_type_id = activity.wellbeing_activity_type_id
        model.start_date = activity.start_date
        model.end_date = activity.end_date
        model.national_source_id = activity.national_source_id
        model.national_funding_value = activity.national_funding_value
        model.funding_country_id = activity.funding_country_id
        model.international_source_entity_name = activity.international_source_entity_name
        model.international_funding_value = activity.international_funding_value
        model.save()
        return self._to_domain(model)

    def delete(self, id: int) -> bool:
        deleted, _ = WellbeingActivityModel.objects.filter(id=id).delete()
        return deleted > 0

    def _to_domain(self, model: WellbeingActivityModel) -> WellbeingActivity:
        return WellbeingActivity(
            id=model.id,
            year=model.year,
            semester=model.semester,
            organization_unit_code=model.organization_unit_code,
            activity_code=model.activity_code,
            activity_description=model.activity_description,
            wellbeing_activity_type_id=model.wellbeing_activity_type_id,
            start_date=model.start_date,
            end_date=model.end_date,
            national_source_id=model.national_source_id,
            national_funding_value=model.national_funding_value,
            funding_country_id=model.funding_country_id,
            international_source_entity_name=model.international_source_entity_name,
            international_funding_value=model.international_funding_value,
        )

