from __future__ import annotations

from datetime import datetime

from audit.domain.ports.audit_query_repository import AuditQueryRepository
from audit.infraestructure.persistence.django.models import AuditLogModel


class DjangoAuditQueryRepository(AuditQueryRepository):
    def list_paginated(
        self,
        page: int,
        page_size: int,
        action: str | None = None,
        module: str | None = None,
        user_email: str | None = None,
        date_from: datetime | None = None,
        date_to: datetime | None = None,
    ) -> tuple[int, list[dict]]:
        if page < 1:
            page = 1
        if page_size < 1:
            page_size = 20
        if page_size > 200:
            page_size = 200

        qs = AuditLogModel.objects.all().order_by("-id")

        if action:
            qs = qs.filter(action=action)
        if module:
            qs = qs.filter(module=module)
        if user_email:
            qs = qs.filter(user_email__iexact=user_email)
        if date_from:
            qs = qs.filter(created_at__gte=date_from)
        if date_to:
            qs = qs.filter(created_at__lte=date_to)

        total = qs.count()
        offset = (page - 1) * page_size
        items = qs[offset : offset + page_size]

        results = [
            {
                "id": m.id,
                "created_at": m.created_at.isoformat() if m.created_at else None,
                "action": m.action,
                "method": m.method,
                "path": m.path,
                "status_code": m.status_code,
                "user_id": m.user_id,
                "user_email": m.user_email,
                "user_role": m.user_role,
                "ip": m.ip,
                "user_agent": m.user_agent,
                "view_name": m.view_name,
                "module": m.module,
                "resource_id": m.resource_id,
                "request_data": m.request_data,
                "response_data": m.response_data,
            }
            for m in items
        ]
        return total, results

