from __future__ import annotations

from abc import ABC, abstractmethod

from notifications.domain.entities.notification import Notification


class NotificationRepository(ABC):
    @abstractmethod
    def create(self, notification: Notification) -> Notification:
        raise NotImplementedError

    @abstractmethod
    def list_paginated(
        self, user_id: int, page: int, page_size: int, is_read: bool | None = None
    ) -> tuple[int, list[Notification]]:
        raise NotImplementedError

    @abstractmethod
    def unread_count(self, user_id: int) -> int:
        raise NotImplementedError

    @abstractmethod
    def mark_read(self, user_id: int, notification_id: int) -> bool:
        raise NotImplementedError

    @abstractmethod
    def mark_all_read(self, user_id: int) -> int:
        raise NotImplementedError

