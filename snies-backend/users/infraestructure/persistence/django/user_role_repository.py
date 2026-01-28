from users.domain.ports.user_role_repository import UserRoleRepository
from users.models import UserModel


class DjangoUserRoleRepository(UserRoleRepository):
    def assign_role(self, user_id: int, role_id: int) -> None:
        user = UserModel.objects.get(id=user_id)
        user.role_id = role_id
        user.save(update_fields=["role"])

