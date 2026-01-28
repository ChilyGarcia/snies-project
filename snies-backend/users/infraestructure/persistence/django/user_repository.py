from domain.entities.users import User
from domain.ports.user_repository import UserRepository
from users.models import UserModel


class DjangoUserRepository(UserRepository):
    def create(self, user: User) -> User:
        user_model = UserModel.objects.create_user(
            email=user.email, password=user.password, name=user.name
        )
        return self._to_domain(user_model)

    def get_by_id(self, user_id: int) -> User | None:
        try:
            user_model = UserModel.objects.get(id=user_id)
            return self._to_domain(user_model)
        except UserModel.DoesNotExist:
            return None

    def get_by_email(self, email: str) -> User | None:
        try:
            user_model = UserModel.objects.get(email=email)
            return self._to_domain(user_model)
        except UserModel.DoesNotExist:
            return None

    def update(self, user: User) -> User | None:
        try:
            user_model = UserModel.objects.get(id=user.id)
            user_model.name = user.name
            user_model.email = user.email
            user_model.password = user.password
            user_model.save()
            return self._to_domain(user_model)
        except UserModel.DoesNotExist:
            return None

    def delete(self, user_id: int) -> None:
        try:
            user_model = UserModel.objects.get(id=user_id)
            user_model.delete()
        except UserModel.DoesNotExist:
            pass

    def list_paginated(self, page: int, page_size: int) -> tuple[int, list[User]]:
        if page < 1:
            page = 1
        if page_size < 1:
            page_size = 10
        if page_size > 100:
            page_size = 100

        qs = UserModel.objects.select_related("role").all().order_by("id")
        total = qs.count()
        offset = (page - 1) * page_size
        items = qs[offset : offset + page_size]
        return total, [self._to_domain(u) for u in items]

    def _to_domain(self, user_model: UserModel) -> User:
        return User(
            id=user_model.id,
            name=user_model.name,
            email=user_model.email,
            password=user_model.password,
            role_id=getattr(user_model, "role_id", None),
            role_name=getattr(getattr(user_model, "role", None), "name", None),
        )
