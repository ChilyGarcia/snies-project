from dataclasses import dataclass


@dataclass(frozen=True)
class RolePermission:
    role_id: int
    module: str  # e.g. "courses", "wellbeing"
    can_view: bool
    can_create: bool
    can_edit: bool
    can_delete: bool

