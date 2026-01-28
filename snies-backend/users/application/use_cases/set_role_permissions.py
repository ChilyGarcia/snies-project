from users.domain.entities.role_permission import RolePermission
from users.domain.ports.role_repository import RoleRepository


class SetRolePermissionsUseCase:
    def __init__(self, role_repository: RoleRepository):
        self.role_repository = role_repository

    def execute(self, role_id: int, permissions: list[RolePermission]) -> None:
        self.role_repository.set_permissions(role_id=role_id, permissions=permissions)

