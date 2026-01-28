from django.urls import path

from wellbeing_human_resources.presentation.api.wellbeing_human_resources.views import (
    WellbeingHumanResourceCreateAPIView,
    WellbeingHumanResourceDetailAPIView,
    WellbeingHumanResourceListAPIView,
)


urlpatterns = [
    path("create/", WellbeingHumanResourceCreateAPIView.as_view(), name="wellbeing-hr-create"),
    path("list/", WellbeingHumanResourceListAPIView.as_view(), name="wellbeing-hr-list"),
    path("<int:id>/", WellbeingHumanResourceDetailAPIView.as_view(), name="wellbeing-hr-detail"),
]

