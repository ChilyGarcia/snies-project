from __future__ import annotations

from abc import ABC, abstractmethod

from software_activities.domain.entities.software_activity import (
    SoftwareActivity,
    BeneficiaryBreakdown,
)


class SoftwareActivityRepository(ABC):
    @abstractmethod
    def create(
        self,
        activity: SoftwareActivity,
        breakdowns: list[BeneficiaryBreakdown] | None = None,
    ) -> SoftwareActivity:
        raise NotImplementedError

    @abstractmethod
    def bulk_create(
        self,
        activities: list[SoftwareActivity],
        breakdowns_by_temp_index: dict[int, list[BeneficiaryBreakdown]] | None = None,
    ) -> int:
        """
        Crea muchas actividades en una transacción.
        breakdowns_by_temp_index usa el índice del listado de activities como key.
        Retorna cantidad creada.
        """
        raise NotImplementedError

    @abstractmethod
    def list(self, limit: int = 100, offset: int = 0) -> list[SoftwareActivity]:
        raise NotImplementedError

    @abstractmethod
    def list_with_breakdowns(
        self, limit: int = 100, offset: int = 0
    ) -> list[tuple[SoftwareActivity, list[BeneficiaryBreakdown]]]:
        """
        Retorna actividades junto a su desglose de beneficiarios por programa.
        """
        raise NotImplementedError

