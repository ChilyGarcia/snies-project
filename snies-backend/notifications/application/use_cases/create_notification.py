from notifications.domain.entities.notification import Notification
from notifications.domain.ports.notification_repository import NotificationRepository


class CreateNotificationUseCase:
    def __init__(self, notification_repository: NotificationRepository):
        self.notification_repository = notification_repository

    def execute(self, notification: Notification) -> Notification:
        return self.notification_repository.create(notification)

