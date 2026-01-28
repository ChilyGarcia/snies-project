from abc import ABC, abstractmethod
from courses.domain.entities.course import Course

class CourseRepository(ABC):

    @abstractmethod
    def create(self, course: Course) -> Course:
        pass
    
    @abstractmethod
    def get_by_id(self, id: int) -> Course:
        pass

    @abstractmethod
    def list(self) -> list[Course]:
        pass