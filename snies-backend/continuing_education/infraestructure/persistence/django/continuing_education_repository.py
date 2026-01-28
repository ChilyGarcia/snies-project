from continuing_education.domain.ports.continuing_education_repository import ContinuingEducationRepository
from continuing_education.domain.entities.continuing_education import ContinuingEducation
from continuing_education.infraestructure.persistence.django.models import ContinuingEducationModel

class ContinuingEducationRepositoryDjango(ContinuingEducationRepository):
    def create(self, continuing_education: ContinuingEducation) -> ContinuingEducation:
        continuing_education_model = ContinuingEducationModel.objects.create(
            year=continuing_education.year,
            semester=continuing_education.semester,
            num_hours=continuing_education.num_hours,
            id_course_id=continuing_education.id_course,
            value=continuing_education.value,
        )
        return self._to_domain(continuing_education_model)

    def list(
        self, year: str | None = None, semester: int | None = None
    ) -> list[ContinuingEducation]:
        qs = ContinuingEducationModel.objects.all().order_by("id")
        if year:
            qs = qs.filter(year=str(year))
        if semester is not None:
            qs = qs.filter(semester=int(semester))
        return [self._to_domain(m) for m in qs]

    def _to_domain(self, continuing_education_model: ContinuingEducationModel) -> ContinuingEducation:
        return ContinuingEducation(
            id=continuing_education_model.id,
            year=continuing_education_model.year,
            semester=continuing_education_model.semester,
            num_hours=continuing_education_model.num_hours,
            id_course=continuing_education_model.id_course_id,
            value=continuing_education_model.value,
        )