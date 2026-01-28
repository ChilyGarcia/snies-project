from __future__ import annotations

from abc import ABC, abstractmethod

from continuing_education_teachers.domain.entities.continuing_education_teacher import (
    ContinuingEducationTeacher,
)


class ContinuingEducationTeacherRepository(ABC):
    @abstractmethod
    def create(self, teacher: ContinuingEducationTeacher) -> ContinuingEducationTeacher:
        raise NotImplementedError

    @abstractmethod
    def list(self, year: str | None = None, semester: int | None = None) -> list[ContinuingEducationTeacher]:
        raise NotImplementedError

    @abstractmethod
    def get_by_id(self, teacher_id: int) -> ContinuingEducationTeacher | None:
        raise NotImplementedError

    @abstractmethod
    def update(self, teacher: ContinuingEducationTeacher) -> ContinuingEducationTeacher | None:
        raise NotImplementedError

    @abstractmethod
    def delete(self, teacher_id: int) -> bool:
        raise NotImplementedError

