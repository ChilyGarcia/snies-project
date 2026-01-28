from datetime import datetime

from audit.domain.ports.audit_query_repository import AuditQueryRepository


class ListAuditLogsUseCase:
    def __init__(self, audit_query_repository: AuditQueryRepository):
        self.audit_query_repository = audit_query_repository

    def execute(
        self,
        page: int,
        page_size: int,
        action: str | None = None,
        module: str | None = None,
        user_email: str | None = None,
        date_from: datetime | None = None,
        date_to: datetime | None = None,
    ) -> tuple[int, list[dict]]:
        return self.audit_query_repository.list_paginated(
            page=page,
            page_size=page_size,
            action=action,
            module=module,
            user_email=user_email,
            date_from=date_from,
            date_to=date_to,
        )

