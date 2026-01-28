from __future__ import annotations

from abc import ABC, abstractmethod


class StatsRepository(ABC):
    @abstractmethod
    def get_dashboard(self, year: str | None, semester: int | None, top_n: int) -> dict:
        raise NotImplementedError

