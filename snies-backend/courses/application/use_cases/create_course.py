from courses.domain.ports.course_repository import CourseRepository
from courses.domain.entities.course import Course

class CreateCourseUseCase:

    def __init__(self, course_repository: CourseRepository):
        self.course_repository = course_repository

    def execute(self, course: Course) -> Course:
        return self.course_repository.create(course)