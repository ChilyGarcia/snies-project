from continuing_education.domain.entities.continuing_education import ContinuingEducation
from continuing_education.domain.ports.continuing_education_repository import ContinuingEducationRepository
from continuing_education.domain.exceptions.continuing_education_exception import CourseNotFoundException
from courses.domain.ports.course_repository import CourseRepository

class CreateContinuingEducationUseCase:
    def __init__(self, continuing_education_repository: ContinuingEducationRepository, course_repository: CourseRepository):
        self.continuing_education_repository = continuing_education_repository
        self.course_repository = course_repository
    
    def execute(self, continuing_education: ContinuingEducation) -> ContinuingEducation:

        course = self.course_repository.get_by_id(continuing_education.id_course)
        if not course:
            raise CourseNotFoundException("Course not found")

        return self.continuing_education_repository.create(continuing_education)
