from __future__ import annotations

from abc import ABC, abstractmethod

from wellbeing_human_resources.domain.entities.wellbeing_human_resource import (
    WellbeingHumanResource,
)


class WellbeingHumanResourceRepository(ABC):
    @abstractmethod
    def create(self, item: WellbeingHumanResource) -> WellbeingHumanResource:
        raise NotImplementedError

    @abstractmethod
    def list(self, year: str | None = None, semester: int | None = None) -> list[WellbeingHumanResource]:
        raise NotImplementedError

    @abstractmethod
    def get_by_id(self, item_id: int) -> WellbeingHumanResource | None:
        raise NotImplementedError

    @abstractmethod
    def update(self, item: WellbeingHumanResource) -> WellbeingHumanResource | None:
        raise NotImplementedError

    @abstractmethod
    def delete(self, item_id: int) -> bool:
        raise NotImplementedError

