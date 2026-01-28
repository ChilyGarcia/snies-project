from django.urls import path

from stats.presentation.api.stats.views import StatsDashboardAPIView


urlpatterns = [
    path("dashboard/", StatsDashboardAPIView.as_view()),
]

