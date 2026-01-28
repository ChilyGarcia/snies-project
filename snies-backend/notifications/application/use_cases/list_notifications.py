from notifications.domain.entities.notification import Notification
from notifications.domain.ports.notification_repository import NotificationRepository


class ListNotificationsUseCase:
    def __init__(self, notification_repository: NotificationRepository):
        self.notification_repository = notification_repository

    def execute(
        self, user_id: int, page: int, page_size: int, is_read: bool | None = None
    ) -> tuple[int, list[Notification]]:
        return self.notification_repository.list_paginated(
            user_id=user_id, page=page, page_size=page_size, is_read=is_read
        )

