from users.domain.ports.user_role_repository import UserRoleRepository


class AssignRoleToUserUseCase:
    def __init__(self, user_role_repository: UserRoleRepository):
        self.user_role_repository = user_role_repository

    def execute(self, user_id: int, role_id: int) -> None:
        self.user_role_repository.assign_role(user_id=user_id, role_id=role_id)

