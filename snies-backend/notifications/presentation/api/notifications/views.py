from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from audit.presentation.audited_api_view import AuditedAPIView
from notifications.application.use_cases.list_notifications import ListNotificationsUseCase
from notifications.application.use_cases.mark_all_read import MarkAllReadUseCase
from notifications.application.use_cases.mark_notification_read import MarkNotificationReadUseCase
from notifications.application.use_cases.unread_count import UnreadCountUseCase
from notifications.infraestructure.persistence.django.notification_repository import (
    DjangoNotificationRepository,
)


class NotificationListAPIView(AuditedAPIView):
    permission_classes = [IsAuthenticated]
    audit_enabled = False

    def get(self, request):
        user_id = request.user.id
        try:
            page = int(request.query_params.get("page", "1"))
            page_size = int(request.query_params.get("page_size", "20"))
        except ValueError:
            return Response({"error": "Invalid pagination params"}, status=status.HTTP_400_BAD_REQUEST)

        is_read_param = request.query_params.get("is_read")
        is_read = None
        if is_read_param is not None:
            v = is_read_param.strip().lower()
            if v in ("true", "1", "yes"):
                is_read = True
            elif v in ("false", "0", "no"):
                is_read = False
            else:
                return Response({"error": "is_read must be true/false"}, status=status.HTTP_400_BAD_REQUEST)

        use_case = ListNotificationsUseCase(notification_repository=DjangoNotificationRepository())
        total, items = use_case.execute(user_id=user_id, page=page, page_size=page_size, is_read=is_read)
        data = {
            "count": total,
            "page": page,
            "page_size": page_size,
            "results": [
                {
                    "id": n.id,
                    "created_at": n.created_at.isoformat() if n.created_at else None,
                    "is_read": n.is_read,
                    "read_at": n.read_at.isoformat() if n.read_at else None,
                    "title": n.title,
                    "message": n.message,
                    "module": n.module,
                    "action": n.action,
                    "resource_id": n.resource_id,
                    "level": n.level,
                }
                for n in items
            ],
        }
        return Response(data, status=status.HTTP_200_OK)


class NotificationUnreadCountAPIView(AuditedAPIView):
    permission_classes = [IsAuthenticated]
    audit_enabled = False

    def get(self, request):
        use_case = UnreadCountUseCase(notification_repository=DjangoNotificationRepository())
        count = use_case.execute(user_id=request.user.id)
        return Response({"unread_count": count}, status=status.HTTP_200_OK)


class NotificationMarkReadAPIView(AuditedAPIView):
    permission_classes = [IsAuthenticated]
    audit_enabled = False

    def post(self, request, id: int):
        use_case = MarkNotificationReadUseCase(notification_repository=DjangoNotificationRepository())
        ok = use_case.execute(user_id=request.user.id, notification_id=id)
        if not ok:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"message": "Marked as read"}, status=status.HTTP_200_OK)


class NotificationMarkAllReadAPIView(AuditedAPIView):
    permission_classes = [IsAuthenticated]
    audit_enabled = False

    def post(self, request):
        use_case = MarkAllReadUseCase(notification_repository=DjangoNotificationRepository())
        updated = use_case.execute(user_id=request.user.id)
        return Response({"updated": updated}, status=status.HTTP_200_OK)

