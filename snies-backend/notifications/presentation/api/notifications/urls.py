from django.urls import path

from notifications.presentation.api.notifications.views import (
    NotificationListAPIView,
    NotificationMarkAllReadAPIView,
    NotificationMarkReadAPIView,
    NotificationUnreadCountAPIView,
)


urlpatterns = [
    path("", NotificationListAPIView.as_view(), name="notifications-list"),
    path("unread-count/", NotificationUnreadCountAPIView.as_view(), name="notifications-unread-count"),
    path("<int:id>/read/", NotificationMarkReadAPIView.as_view(), name="notifications-read"),
    path("read-all/", NotificationMarkAllReadAPIView.as_view(), name="notifications-read-all"),
]

