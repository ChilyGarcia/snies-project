from users.domain.entities.role import Role
from users.domain.ports.role_repository import RoleRepository


class CreateRoleUseCase:
    def __init__(self, role_repository: RoleRepository):
        self.role_repository = role_repository

    def execute(self, role: Role) -> Role:
        return self.role_repository.create(role)

