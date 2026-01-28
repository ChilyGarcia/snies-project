from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from audit.presentation.audited_api_view import AuditedAPIView
from users.presentation.permissions import IsRootUser

from users.application.use_cases.assign_role_to_user import AssignRoleToUserUseCase
from users.application.use_cases.create_role import CreateRoleUseCase
from users.application.use_cases.list_roles import ListRolesUseCase
from users.application.use_cases.set_role_permissions import SetRolePermissionsUseCase
from users.domain.entities.role import Role
from users.domain.entities.role_permission import RolePermission
from users.infraestructure.persistence.django.role_repository import DjangoRoleRepository
from users.infraestructure.persistence.django.user_role_repository import DjangoUserRoleRepository
from users.models import UserModel
from notifications.application.use_cases.create_notification import CreateNotificationUseCase
from notifications.domain.entities.notification import Notification
from notifications.infraestructure.persistence.django.notification_repository import (
    DjangoNotificationRepository,
)
from users.presentation.api.roles.serializers import (
    AssignRoleSerializer,
    CreateRoleSerializer,
    SetRolePermissionsSerializer,
)


class RootOnlyAPIView(AuditedAPIView):
    permission_classes = [IsAuthenticated, IsRootUser]


class RoleListCreateAPIView(RootOnlyAPIView):
    def get(self, request):
        use_case = ListRolesUseCase(role_repository=DjangoRoleRepository())
        roles = use_case.execute()
        return Response(
            [{"id": r.id, "name": r.name, "description": r.description} for r in roles],
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        serializer = CreateRoleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        use_case = CreateRoleUseCase(role_repository=DjangoRoleRepository())
        role = Role(
            id=None,
            name=serializer.validated_data["name"],
            description=serializer.validated_data.get("description") or None,
        )
        created = use_case.execute(role)
        return Response(
            {"id": created.id, "message": "Role created successfully"},
            status=status.HTTP_201_CREATED,
        )


class RolePermissionsAPIView(RootOnlyAPIView):
    def get(self, request, role_id: int):
        repo = DjangoRoleRepository()
        permissions = repo.get_permissions(role_id=role_id)
        data = [
            {
                "module": p.module,
                "can_view": p.can_view,
                "can_create": p.can_create,
                "can_edit": p.can_edit,
                "can_delete": p.can_delete,
            }
            for p in permissions
        ]
        return Response(data, status=status.HTTP_200_OK)

    def put(self, request, role_id: int):
        serializer = SetRolePermissionsSerializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)

        permissions = [
            RolePermission(
                role_id=role_id,
                module=p["module"],
                can_view=p["can_view"],
                can_create=p["can_create"],
                can_edit=p["can_edit"],
                can_delete=p["can_delete"],
            )
            for p in serializer.validated_data
        ]

        use_case = SetRolePermissionsUseCase(role_repository=DjangoRoleRepository())
        use_case.execute(role_id=role_id, permissions=permissions)

        # Notify users with this role that their permissions changed
        affected_users = UserModel.objects.filter(role_id=role_id).values_list("id", flat=True)
        notifier = CreateNotificationUseCase(notification_repository=DjangoNotificationRepository())
        for uid in affected_users:
            notifier.execute(
                Notification(
                    id=None,
                    user_id=int(uid),
                    created_at=None,
                    read_at=None,
                    is_read=False,
                    title="Permisos actualizados",
                    message="Tus permisos fueron actualizados por un administrador.",
                    module="roles",
                    action="permissions_updated",
                    resource_id=str(role_id),
                    level="info",
                )
            )

        return Response({"message": "Permissions updated successfully"}, status=status.HTTP_200_OK)


class AssignUserRoleAPIView(RootOnlyAPIView):
    def post(self, request, user_id: int):
        serializer = AssignRoleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        use_case = AssignRoleToUserUseCase(user_role_repository=DjangoUserRoleRepository())
        use_case.execute(user_id=user_id, role_id=serializer.validated_data["role_id"])

        notifier = CreateNotificationUseCase(notification_repository=DjangoNotificationRepository())
        notifier.execute(
            Notification(
                id=None,
                user_id=user_id,
                created_at=None,
                read_at=None,
                is_read=False,
                title="Rol asignado",
                message="Se te asignó un nuevo rol. Tus permisos pueden haber cambiado.",
                module="roles",
                action="role_assigned",
                resource_id=str(serializer.validated_data["role_id"]),
                level="info",
            )
        )

        return Response({"message": "Role assigned successfully"}, status=status.HTTP_200_OK)

