from django.urls import path

from continuing_education_beneficiaries.presentation.api.continuing_education_beneficiaries.views import (
    ContinuingEducationBeneficiaryCreateAPIView,
    ContinuingEducationBeneficiaryDetailAPIView,
    ContinuingEducationBeneficiaryListAPIView,
)


urlpatterns = [
    path("create/", ContinuingEducationBeneficiaryCreateAPIView.as_view(), name="ce-beneficiaries-create"),
    path("list/", ContinuingEducationBeneficiaryListAPIView.as_view(), name="ce-beneficiaries-list"),
    path("<int:id>/", ContinuingEducationBeneficiaryDetailAPIView.as_view(), name="ce-beneficiaries-detail"),
]

