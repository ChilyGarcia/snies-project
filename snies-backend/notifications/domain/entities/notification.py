from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class Notification:
    id: int | None
    user_id: int
    created_at: datetime | None
    read_at: datetime | None
    is_read: bool
    title: str
    message: str
    module: str | None = None
    action: str | None = None
    resource_id: str | None = None
    level: str | None = None  # info|warning|success|error

