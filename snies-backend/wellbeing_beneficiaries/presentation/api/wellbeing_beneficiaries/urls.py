from django.urls import path

from wellbeing_beneficiaries.presentation.api.wellbeing_beneficiaries.views import (
    WellbeingBeneficiaryActivityCreateAPIView,
    WellbeingBeneficiaryActivityDetailAPIView,
    WellbeingBeneficiaryActivityListAPIView,
)

urlpatterns = [
    path(
        "create/",
        WellbeingBeneficiaryActivityCreateAPIView.as_view(),
        name="wellbeing-beneficiary-create",
    ),
    path(
        "list/",
        WellbeingBeneficiaryActivityListAPIView.as_view(),
        name="wellbeing-beneficiary-list",
    ),
    path(
        "<int:id>/",
        WellbeingBeneficiaryActivityDetailAPIView.as_view(),
        name="wellbeing-beneficiary-detail",
    ),
]

