from domain.entities.users import User
from domain.ports.user_repository import UserRepository


class CreateUserUseCase:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def execute(self, user: User) -> User:
        return self.user_repository.create(user)
