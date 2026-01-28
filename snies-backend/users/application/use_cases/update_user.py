from domain.entities.users import User
from domain.ports.user_repository import UserRepository
from domain.exceptions.user_exception import UserNotFoundException


class UpdateUserUseCase:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def execute(self, user_id: int, user: User) -> User:
        user = self.user_repository.get_by_id(user_id)

        if not user:
            raise UserNotFoundException("User not found")

        return self.user_repository.update(user)
