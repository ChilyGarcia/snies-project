from abc import ABC, abstractmethod
from continuing_education.domain.entities.continuing_education import ContinuingEducation

class ContinuingEducationRepository(ABC):
    @abstractmethod
    def create(self, continuing_education: ContinuingEducation):
        pass    

    @abstractmethod
    def list(
        self, year: str | None = None, semester: int | None = None
    ) -> list[ContinuingEducation]:
        pass