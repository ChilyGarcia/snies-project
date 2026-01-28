from abc import ABC, abstractmethod
from domain.entities.users import User


class UserRepository(ABC):
    @abstractmethod
    def create(self, user: User) -> User:
        pass

    @abstractmethod
    def get_by_id(self, user_id: int) -> User:
        pass

    @abstractmethod
    def get_by_email(self, email: str) -> User:
        pass

    @abstractmethod
    def update(self, user: User) -> User:
        pass

    @abstractmethod
    def delete(self, user_id: int) -> None:
        pass

    @abstractmethod
    def list_paginated(self, page: int, page_size: int) -> tuple[int, list[User]]:
        """Returns (total_count, users_page)."""
        pass