from __future__ import annotations

from abc import ABC, abstractmethod
from datetime import datetime


class AuditQueryRepository(ABC):
    @abstractmethod
    def list_paginated(
        self,
        page: int,
        page_size: int,
        action: str | None = None,
        module: str | None = None,
        user_email: str | None = None,
        date_from: datetime | None = None,
        date_to: datetime | None = None,
    ) -> tuple[int, list[dict]]:
        """Returns (total_count, results_page). Each result is a dict ready for JSON."""
        raise NotImplementedError

