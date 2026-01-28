from __future__ import annotations

from abc import ABC, abstractmethod

from continuing_education_beneficiaries.domain.entities.continuing_education_beneficiary import (
    ContinuingEducationBeneficiary,
)


class ContinuingEducationBeneficiaryRepository(ABC):
    @abstractmethod
    def create(self, beneficiary: ContinuingEducationBeneficiary) -> ContinuingEducationBeneficiary:
        raise NotImplementedError

    @abstractmethod
    def list(
        self, year: str | None = None, semester: int | None = None
    ) -> list[ContinuingEducationBeneficiary]:
        raise NotImplementedError

    @abstractmethod
    def get_by_id(self, beneficiary_id: int) -> ContinuingEducationBeneficiary | None:
        raise NotImplementedError

    @abstractmethod
    def update(self, beneficiary: ContinuingEducationBeneficiary) -> ContinuingEducationBeneficiary | None:
        raise NotImplementedError

    @abstractmethod
    def delete(self, beneficiary_id: int) -> bool:
        raise NotImplementedError

