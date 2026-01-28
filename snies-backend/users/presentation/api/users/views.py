from audit.presentation.audited_api_view import AuditedAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .serializers import CreateUserSerializer, UserMeSerializer
from users.application.use_cases.create_user import CreateUserUseCase
from users.application.use_cases.check_permission import CheckPermissionUseCase
from users.application.use_cases.get_user import GetUserUseCase
from users.application.use_cases.list_users import ListUsersUseCase
from users.domain.exceptions.user_exception import InvalidUserException
from users.domain.exceptions.user_exception import UserNotFoundException
from users.infraestructure.persistence.django.role_repository import DjangoRoleRepository
from users.infraestructure.persistence.django.user_repository import DjangoUserRepository

from users.domain.entities.users import User


class UserCreateAPIView(AuditedAPIView):
    def post(self, request):
        serializer = CreateUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        use_case = CreateUserUseCase(user_repository=DjangoUserRepository())

        try:
            user = User(
                id=None,
                name=serializer.validated_data["name"],
                email=serializer.validated_data["email"],
                password=serializer.validated_data["password"],
            )
            created_user = use_case.execute(user)
            return Response({"id": created_user.id}, status=status.HTTP_201_CREATED)
        except InvalidUserException as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserMeAPIView(AuditedAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        use_case = GetUserUseCase(user_repository=DjangoUserRepository())

        try:
            user = use_case.execute(user_id=request.user.id)
            data = UserMeSerializer(
                {"id": user.id, "name": user.name, "email": user.email}
            ).data
            return Response(data, status=status.HTTP_200_OK)
        except UserNotFoundException as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserMePermissionsAPIView(AuditedAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        role = getattr(request.user, "role", None)
        if not role:
            return Response({"role": None, "permissions": {}}, status=status.HTTP_200_OK)

        # Root has full access by definition
        if getattr(role, "name", None) == "root":
            return Response(
                {
                    "role": {"id": role.id, "name": role.name},
                    "permissions": {
                        "courses": {"view": True, "create": True, "edit": True, "delete": True},
                        "wellbeing": {"view": True, "create": True, "edit": True, "delete": True},
                    },
                },
                status=status.HTTP_200_OK,
            )

        checker = CheckPermissionUseCase(role_repository=DjangoRoleRepository())
        permissions = {
            "courses": {
                "view": checker.execute(role.id, "courses", "view"),
                "create": checker.execute(role.id, "courses", "create"),
                "edit": checker.execute(role.id, "courses", "edit"),
                "delete": checker.execute(role.id, "courses", "delete"),
            },
            "wellbeing": {
                "view": checker.execute(role.id, "wellbeing", "view"),
                "create": checker.execute(role.id, "wellbeing", "create"),
                "edit": checker.execute(role.id, "wellbeing", "edit"),
                "delete": checker.execute(role.id, "wellbeing", "delete"),
            },
        }
        return Response(
            {"role": {"id": role.id, "name": role.name}, "permissions": permissions},
            status=status.HTTP_200_OK,
        )


class UserListAPIView(AuditedAPIView):
    """
    Root-only paginated listing of users.
    GET /api/users/?page=1&page_size=20
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        role = getattr(request.user, "role", None)
        if not (role and getattr(role, "name", None) == "root"):
            return Response({"error": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)

        try:
            page = int(request.query_params.get("page", "1"))
            page_size = int(request.query_params.get("page_size", "20"))
        except ValueError:
            return Response({"error": "Invalid pagination params"}, status=status.HTTP_400_BAD_REQUEST)

        use_case = ListUsersUseCase(user_repository=DjangoUserRepository())
        total, users_page = use_case.execute(page=page, page_size=page_size)

        data = {
            "count": total,
            "page": page,
            "page_size": page_size,
            "results": [
                {"id": u.id, "name": u.name, "email": u.email, "role": getattr(u, "role_name", None)}
                for u in users_page
            ],
        }
        return Response(data, status=status.HTTP_200_OK)
