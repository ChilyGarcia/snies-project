from notifications.domain.ports.notification_repository import NotificationRepository


class MarkAllReadUseCase:
    def __init__(self, notification_repository: NotificationRepository):
        self.notification_repository = notification_repository

    def execute(self, user_id: int) -> int:
        return self.notification_repository.mark_all_read(user_id=user_id)

