from users.domain.entities.users import User
from users.domain.ports.user_repository import UserRepository


class ListUsersUseCase:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def execute(self, page: int, page_size: int) -> tuple[int, list[User]]:
        return self.user_repository.list_paginated(page=page, page_size=page_size)

