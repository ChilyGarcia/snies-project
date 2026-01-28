from django.urls import path

from audit.presentation.api.audit.views import AuditLogListAPIView


urlpatterns = [
    path("logs/", AuditLogListAPIView.as_view(), name="audit-logs-list"),
]

