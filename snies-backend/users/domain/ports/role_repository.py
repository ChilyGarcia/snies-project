from __future__ import annotations

from abc import ABC, abstractmethod

from users.domain.entities.role import Role
from users.domain.entities.role_permission import RolePermission


class RoleRepository(ABC):
    @abstractmethod
    def create(self, role: Role) -> Role:
        raise NotImplementedError

    @abstractmethod
    def list(self) -> list[Role]:
        raise NotImplementedError

    @abstractmethod
    def get_by_name(self, name: str) -> Role | None:
        raise NotImplementedError

    @abstractmethod
    def get_permissions(self, role_id: int) -> list[RolePermission]:
        raise NotImplementedError

    @abstractmethod
    def set_permissions(self, role_id: int, permissions: list[RolePermission]) -> None:
        raise NotImplementedError

