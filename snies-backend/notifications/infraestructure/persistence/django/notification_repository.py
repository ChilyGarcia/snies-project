from datetime import datetime, timezone

from notifications.domain.entities.notification import Notification
from notifications.domain.ports.notification_repository import NotificationRepository
from notifications.infraestructure.persistence.django.models import NotificationModel


class DjangoNotificationRepository(NotificationRepository):
    def create(self, notification: Notification) -> Notification:
        m = NotificationModel.objects.create(
            user_id=notification.user_id,
            title=notification.title,
            message=notification.message,
            module=notification.module,
            action=notification.action,
            resource_id=notification.resource_id,
            level=notification.level,
            is_read=False,
        )
        return self._to_domain(m)

    def list_paginated(
        self, user_id: int, page: int, page_size: int, is_read: bool | None = None
    ) -> tuple[int, list[Notification]]:
        if page < 1:
            page = 1
        if page_size < 1:
            page_size = 20
        if page_size > 200:
            page_size = 200

        qs = NotificationModel.objects.filter(user_id=user_id).order_by("-id")
        if is_read is not None:
            qs = qs.filter(is_read=bool(is_read))

        total = qs.count()
        offset = (page - 1) * page_size
        items = qs[offset : offset + page_size]
        return total, [self._to_domain(m) for m in items]

    def unread_count(self, user_id: int) -> int:
        return NotificationModel.objects.filter(user_id=user_id, is_read=False).count()

    def mark_read(self, user_id: int, notification_id: int) -> bool:
        now = datetime.now(timezone.utc)
        updated = (
            NotificationModel.objects.filter(id=notification_id, user_id=user_id, is_read=False)
            .update(is_read=True, read_at=now)
        )
        return updated > 0

    def mark_all_read(self, user_id: int) -> int:
        now = datetime.now(timezone.utc)
        return (
            NotificationModel.objects.filter(user_id=user_id, is_read=False)
            .update(is_read=True, read_at=now)
        )

    def _to_domain(self, m: NotificationModel) -> Notification:
        return Notification(
            id=m.id,
            user_id=m.user_id,
            created_at=m.created_at,
            read_at=m.read_at,
            is_read=m.is_read,
            title=m.title,
            message=m.message,
            module=m.module,
            action=m.action,
            resource_id=m.resource_id,
            level=m.level,
        )

