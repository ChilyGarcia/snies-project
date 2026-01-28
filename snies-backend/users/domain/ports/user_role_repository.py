from abc import ABC, abstractmethod


class UserRoleRepository(ABC):
    @abstractmethod
    def assign_role(self, user_id: int, role_id: int) -> None:
        raise NotImplementedError

