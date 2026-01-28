from rest_framework.permissions import BasePermission

from users.application.use_cases.check_permission import CheckPermissionUseCase
from users.infraestructure.persistence.django.role_repository import DjangoRoleRepository


class IsRootUser(BasePermission):
    def has_permission(self, request, view) -> bool:
        user = getattr(request, "user", None)
        if not user or not getattr(user, "is_authenticated", False):
            return False
        role = getattr(user, "role", None)
        return bool(role and getattr(role, "name", None) == "root")


class HasModulePermission(BasePermission):
    """
    Expects the view to define:
      - required_module: str
      - required_action: str ("view"|"create"|"edit"|"delete")
    Root users (role.name == "root") bypass checks.
    """

    def has_permission(self, request, view) -> bool:
        required_module = getattr(view, "required_module", None)
        required_action = getattr(view, "required_action", None)

        # If the view didn't declare RBAC requirements, allow (backwards compatible).
        if not required_module or not required_action:
            return True

        user = getattr(request, "user", None)
        if not user or not getattr(user, "is_authenticated", False):
            return False

        role = getattr(user, "role", None)
        if not role:
            return False

        if getattr(role, "name", None) == "root":
            return True

        use_case = CheckPermissionUseCase(role_repository=DjangoRoleRepository())
        return use_case.execute(role_id=role.id, module=required_module, action=required_action)

