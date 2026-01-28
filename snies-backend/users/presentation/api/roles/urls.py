from django.urls import path

from users.presentation.api.roles.views import (
    AssignUserRoleAPIView,
    RoleListCreateAPIView,
    RolePermissionsAPIView,
)


urlpatterns = [
    path("", RoleListCreateAPIView.as_view()),
    path("<int:role_id>/permissions/", RolePermissionsAPIView.as_view()),
    path("assign/<int:user_id>/", AssignUserRoleAPIView.as_view()),
]

