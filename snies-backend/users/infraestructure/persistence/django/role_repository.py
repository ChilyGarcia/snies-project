from __future__ import annotations

from users.domain.entities.role import Role
from users.domain.entities.role_permission import RolePermission
from users.domain.ports.role_repository import RoleRepository
from users.models import RoleModel, RolePermissionModel


class DjangoRoleRepository(RoleRepository):
    def create(self, role: Role) -> Role:
        role_model = RoleModel.objects.create(name=role.name, description=role.description)
        return Role(id=role_model.id, name=role_model.name, description=role_model.description)

    def list(self) -> list[Role]:
        return [Role(id=r.id, name=r.name, description=r.description) for r in RoleModel.objects.all().order_by("name")]

    def get_by_name(self, name: str) -> Role | None:
        try:
            r = RoleModel.objects.get(name=name)
            return Role(id=r.id, name=r.name, description=r.description)
        except RoleModel.DoesNotExist:
            return None

    def get_permissions(self, role_id: int) -> list[RolePermission]:
        qs = RolePermissionModel.objects.filter(role_id=role_id).all()
        return [
            RolePermission(
                role_id=p.role_id,
                module=p.module,
                can_view=p.can_view,
                can_create=p.can_create,
                can_edit=p.can_edit,
                can_delete=p.can_delete,
            )
            for p in qs
        ]

    def set_permissions(self, role_id: int, permissions: list[RolePermission]) -> None:
        # Replace permissions for the given role_id
        RolePermissionModel.objects.filter(role_id=role_id).delete()
        RolePermissionModel.objects.bulk_create(
            [
                RolePermissionModel(
                    role_id=role_id,
                    module=p.module,
                    can_view=p.can_view,
                    can_create=p.can_create,
                    can_edit=p.can_edit,
                    can_delete=p.can_delete,
                )
                for p in permissions
            ]
        )

