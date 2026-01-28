from abc import ABC, abstractmethod

from wellbeing_beneficiaries.domain.entities.wellbeing_beneficiary_activity import (
    WellbeingBeneficiaryActivity,
)


class WellbeingBeneficiaryActivityRepository(ABC):
    @abstractmethod
    def create(
        self, activity: WellbeingBeneficiaryActivity
    ) -> WellbeingBeneficiaryActivity:
        pass

    @abstractmethod
    def list(self) -> list[WellbeingBeneficiaryActivity]:
        pass

    @abstractmethod
    def get_by_id(self, id: int) -> WellbeingBeneficiaryActivity | None:
        pass

    @abstractmethod
    def update(
        self, id: int, activity: WellbeingBeneficiaryActivity
    ) -> WellbeingBeneficiaryActivity | None:
        pass

    @abstractmethod
    def delete(self, id: int) -> bool:
        pass

