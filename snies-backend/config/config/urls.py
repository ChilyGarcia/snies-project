from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("users.presentation.api.auth.urls")),
    path("api/users/", include("users.presentation.api.users.urls")),
    path("api/roles/", include("users.presentation.api.roles.urls")),
    path("api/stats/", include("stats.presentation.api.stats.urls")),
    path("api/audit/", include("audit.presentation.api.audit.urls")),
    path("api/notifications/", include("notifications.presentation.api.notifications.urls")),
    path("api/courses/", include("courses.presentation.api.courses.urls")),
    path(
        "api/continuing_education/",
        include("continuing_education.presentation.api.continuing_education.urls"),
    ),
    path(
        "api/continuing_education_teachers/",
        include(
            "continuing_education_teachers.presentation.api.continuing_education_teachers.urls"
        ),
    ),
    path(
        "api/continuing_education_beneficiaries/",
        include(
            "continuing_education_beneficiaries.presentation.api.continuing_education_beneficiaries.urls"
        ),
    ),
    path(
        "api/wellbeing_activities/",
        include("wellbeing_activities.presentation.api.wellbeing_activities.urls"),
    ),
    path(
        "api/wellbeing_beneficiaries/",
        include("wellbeing_beneficiaries.presentation.api.wellbeing_beneficiaries.urls"),
    ),
    path(
        "api/wellbeing_human_resources/",
        include("wellbeing_human_resources.presentation.api.wellbeing_human_resources.urls"),
    ),
]
