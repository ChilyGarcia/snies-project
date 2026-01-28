from users.domain.ports.role_repository import RoleRepository


class CheckPermissionUseCase:
    def __init__(self, role_repository: RoleRepository):
        self.role_repository = role_repository

    def execute(self, role_id: int, module: str, action: str) -> bool:
        # Root (role_id None) is handled outside; this is pure role-permissions check.
        perms = self.role_repository.get_permissions(role_id)
        for p in perms:
            if p.module != module:
                continue
            if action == "view":
                return p.can_view
            if action == "create":
                return p.can_create
            if action == "edit":
                return p.can_edit
            if action == "delete":
                return p.can_delete
            return False
        return False

