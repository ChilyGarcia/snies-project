from continuing_education_teachers.domain.entities.continuing_education_teacher import (
    ContinuingEducationTeacher,
)
from continuing_education_teachers.domain.ports.continuing_education_teacher_repository import (
    ContinuingEducationTeacherRepository,
)
from continuing_education_teachers.infraestructure.persistence.django.models import (
    ContinuingEducationTeacherModel,
)


class ContinuingEducationTeacherRepositoryDjango(ContinuingEducationTeacherRepository):
    def create(self, teacher: ContinuingEducationTeacher) -> ContinuingEducationTeacher:
        m = ContinuingEducationTeacherModel.objects.create(
            year=teacher.year,
            semester=teacher.semester,
            course_code=teacher.course_code,
            document_type_id=teacher.document_type_id,
            document_number=teacher.document_number,
        )
        return self._to_domain(m)

    def list(self, year: str | None = None, semester: int | None = None) -> list[ContinuingEducationTeacher]:
        qs = ContinuingEducationTeacherModel.objects.all().order_by("id")
        if year:
            qs = qs.filter(year=str(year))
        if semester is not None:
            qs = qs.filter(semester=int(semester))
        return [self._to_domain(m) for m in qs]

    def get_by_id(self, teacher_id: int) -> ContinuingEducationTeacher | None:
        try:
            m = ContinuingEducationTeacherModel.objects.get(id=teacher_id)
            return self._to_domain(m)
        except ContinuingEducationTeacherModel.DoesNotExist:
            return None

    def update(self, teacher: ContinuingEducationTeacher) -> ContinuingEducationTeacher | None:
        try:
            m = ContinuingEducationTeacherModel.objects.get(id=teacher.id)
            m.year = teacher.year
            m.semester = teacher.semester
            m.course_code = teacher.course_code
            m.document_type_id = teacher.document_type_id
            m.document_number = teacher.document_number
            m.save()
            return self._to_domain(m)
        except ContinuingEducationTeacherModel.DoesNotExist:
            return None

    def delete(self, teacher_id: int) -> bool:
        try:
            m = ContinuingEducationTeacherModel.objects.get(id=teacher_id)
            m.delete()
            return True
        except ContinuingEducationTeacherModel.DoesNotExist:
            return False

    def _to_domain(self, m: ContinuingEducationTeacherModel) -> ContinuingEducationTeacher:
        return ContinuingEducationTeacher(
            id=m.id,
            year=m.year,
            semester=m.semester,
            course_code=m.course_code,
            document_type_id=m.document_type_id,
            document_number=m.document_number,
        )

