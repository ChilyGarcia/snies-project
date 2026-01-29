from django.urls import path

from software_activities.presentation.api.software_activities.views import (
    SoftwareActivityListCreateAPIView,
    SoftwareActivityImportExcelAPIView,
    SoftwareActivityExportExcelAPIView,
)


urlpatterns = [
    path("", SoftwareActivityListCreateAPIView.as_view(), name="software-activities-list-create"),
    path("import/", SoftwareActivityImportExcelAPIView.as_view(), name="software-activities-import"),
    path("export/", SoftwareActivityExportExcelAPIView.as_view(), name="software-activities-export"),
]

