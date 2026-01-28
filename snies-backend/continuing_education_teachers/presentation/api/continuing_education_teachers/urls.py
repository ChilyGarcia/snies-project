from django.urls import path

from continuing_education_teachers.presentation.api.continuing_education_teachers.views import (
    ContinuingEducationTeacherCreateAPIView,
    ContinuingEducationTeacherDetailAPIView,
    ContinuingEducationTeacherListAPIView,
)


urlpatterns = [
    path("create/", ContinuingEducationTeacherCreateAPIView.as_view(), name="ce-teachers-create"),
    path("list/", ContinuingEducationTeacherListAPIView.as_view(), name="ce-teachers-list"),
    path("<int:id>/", ContinuingEducationTeacherDetailAPIView.as_view(), name="ce-teachers-detail"),
]

