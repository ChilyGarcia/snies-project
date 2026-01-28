from datetime import datetime

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from audit.application.use_cases.list_audit_logs import ListAuditLogsUseCase
from audit.infraestructure.persistence.django.audit_query_repository import (
    DjangoAuditQueryRepository,
)
from audit.presentation.audited_api_view import AuditedAPIView
from users.presentation.permissions import HasModulePermission


class AuditLogListAPIView(AuditedAPIView):
    """
    GET /api/audit/logs/?page=1&page_size=50&action=create&module=wellbeing&user_email=a@b.com&from=2026-01-01T00:00:00Z&to=2026-01-31T23:59:59Z
    """

    permission_classes = [IsAuthenticated, HasModulePermission]
    required_module = "audit"
    required_action = "view"

    # listing should not audit itself
    audit_enabled = False

    def get(self, request):
        def _parse_dt(value: str | None) -> datetime | None:
            if not value:
                return None
            v = value.strip()
            if v.endswith("Z"):
                v = v[:-1] + "+00:00"
            return datetime.fromisoformat(v)

        try:
            page = int(request.query_params.get("page", "1"))
            page_size = int(request.query_params.get("page_size", "50"))
        except ValueError:
            return Response({"error": "Invalid pagination params"}, status=status.HTTP_400_BAD_REQUEST)

        action = request.query_params.get("action")
        module = request.query_params.get("module")
        user_email = request.query_params.get("user_email")
        try:
            date_from = _parse_dt(request.query_params.get("from"))
            date_to = _parse_dt(request.query_params.get("to"))
        except ValueError:
            return Response({"error": "Invalid datetime params"}, status=status.HTTP_400_BAD_REQUEST)

        use_case = ListAuditLogsUseCase(audit_query_repository=DjangoAuditQueryRepository())
        total, results = use_case.execute(
            page=page,
            page_size=page_size,
            action=action,
            module=module,
            user_email=user_email,
            date_from=date_from,
            date_to=date_to,
        )
        return Response(
            {"count": total, "page": page, "page_size": page_size, "results": results},
            status=status.HTTP_200_OK,
        )

