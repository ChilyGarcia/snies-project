from notifications.domain.ports.notification_repository import NotificationRepository


class MarkNotificationReadUseCase:
    def __init__(self, notification_repository: NotificationRepository):
        self.notification_repository = notification_repository

    def execute(self, user_id: int, notification_id: int) -> bool:
        return self.notification_repository.mark_read(user_id=user_id, notification_id=notification_id)

