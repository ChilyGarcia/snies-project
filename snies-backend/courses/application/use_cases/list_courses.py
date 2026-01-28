from courses.domain.entities.course import Course
from courses.domain.ports.course_repository import CourseRepository


class ListCoursesUseCase:
    def __init__(self, course_repository: CourseRepository):
        self.course_repository = course_repository

    def execute(self) -> list[Course]:
        return self.course_repository.list()

