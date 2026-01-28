from abc import ABC, abstractmethod

from wellbeing_activities.domain.entities.wellbeing_activity import WellbeingActivity


class WellbeingActivityRepository(ABC):
    @abstractmethod
    def create(self, activity: WellbeingActivity) -> WellbeingActivity:
        pass

    @abstractmethod
    def list(self) -> list[WellbeingActivity]:
        pass

    @abstractmethod
    def get_by_id(self, id: int) -> WellbeingActivity | None:
        pass

    @abstractmethod
    def update(self, id: int, activity: WellbeingActivity) -> WellbeingActivity | None:
        pass

    @abstractmethod
    def delete(self, id: int) -> bool:
        pass

