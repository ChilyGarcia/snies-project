from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class AuditLog:
    id: int | None
    created_at: datetime | None
    action: str
    method: str
    path: str
    status_code: int
    user_id: int | None = None
    user_email: str | None = None
    user_role: str | None = None
    ip: str | None = None
    user_agent: str | None = None
    view_name: str | None = None
    module: str | None = None
    resource_id: str | None = None
    request_data: dict | None = None
    response_data: dict | None = None

