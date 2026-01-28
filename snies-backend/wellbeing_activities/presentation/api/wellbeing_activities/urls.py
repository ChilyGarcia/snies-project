from django.urls import path

from wellbeing_activities.presentation.api.wellbeing_activities.views import (
    WellbeingActivityCreateAPIView,
    WellbeingActivityDetailAPIView,
    WellbeingActivityListAPIView,
)

urlpatterns = [
    path("create/", WellbeingActivityCreateAPIView.as_view(), name="wellbeing-create"),
    path("list/", WellbeingActivityListAPIView.as_view(), name="wellbeing-list"),
    path(
        "<int:id>/",
        WellbeingActivityDetailAPIView.as_view(),
        name="wellbeing-detail",
    ),
]

