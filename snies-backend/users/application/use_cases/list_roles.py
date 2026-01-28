from users.domain.entities.role import Role
from users.domain.ports.role_repository import RoleRepository


class ListRolesUseCase:
    def __init__(self, role_repository: RoleRepository):
        self.role_repository = role_repository

    def execute(self) -> list[Role]:
        return self.role_repository.list()

