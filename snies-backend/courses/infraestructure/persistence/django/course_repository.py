from courses.domain.ports.course_repository import CourseRepository
from courses.domain.entities.course import Course
from django.db import models
from courses.infraestructure.persistence.django.models import CourseModel


class CourseRepositoryDjango(CourseRepository):
    def create(self, course: Course) -> Course:
        course_model = CourseModel.objects.create(
            name=course.name,
            code=course.code,
            id_cine_field_detailed=course.id_cine_field_detailed,
            is_extension=course.is_extension,
            is_active=course.is_active,
        )
        return self._to_domain(course_model)

    def get_by_id(self, id: int) -> Course | None:
        try:
            course_model = CourseModel.objects.get(id=id)
            return self._to_domain(course_model)
        except CourseModel.DoesNotExist:
            return None

    def list(self) -> list[Course]:
        qs = CourseModel.objects.all().order_by("id")
        return [self._to_domain(c) for c in qs]

    def _to_domain(self, course_model: CourseModel) -> Course:
        return Course(
            id=course_model.id,
            name=course_model.name,
            code=course_model.code,
            id_cine_field_detailed=course_model.id_cine_field_detailed,
            is_extension=course_model.is_extension,
            is_active=course_model.is_active,
        )