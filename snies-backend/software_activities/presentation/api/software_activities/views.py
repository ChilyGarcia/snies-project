from __future__ import annotations

from audit.presentation.audited_api_view import AuditedAPIView
from rest_framework import status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
from rest_framework.response import Response

from users.presentation.permissions import HasModulePermission

from software_activities.application.use_cases.import_software_activities_from_excel import (
    ImportSoftwareActivitiesFromExcelUseCase,
)
from software_activities.application.use_cases.list_software_activities import (
    ListSoftwareActivitiesUseCase,
)
from software_activities.application.use_cases.export_software_activities_to_excel import (
    ExportSoftwareActivitiesToExcelUseCase,
)
from software_activities.infraestructure.persistence.django.software_activity_repository import (
    SoftwareActivityRepositoryDjango,
)
from software_activities.presentation.api.software_activities.serializers import (
    SoftwareActivitySerializer,
)
from software_activities.infraestructure.persistence.django.models import (
    SoftwareActivityModel,
)


class SoftwareActivityListCreateAPIView(AuditedAPIView):
    permission_classes = [IsAuthenticated, HasModulePermission]
    required_module = "software_activities"

    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def get_permissions(self):
        # DRF evalúa permisos antes de ejecutar get/post,
        # por eso definimos required_action aquí según el método.
        method = getattr(getattr(self, "request", None), "method", "")
        if method == "GET":
            self.required_action = "view"
        elif method == "POST":
            self.required_action = "create"
        return super().get_permissions()

    def get(self, request):
        limit = int(request.query_params.get("limit", "100"))
        offset = int(request.query_params.get("offset", "0"))
        use_case = ListSoftwareActivitiesUseCase(
            repository=SoftwareActivityRepositoryDjango()
        )
        activities = use_case.execute(limit=limit, offset=offset)
        # devolvemos desde ORM para incluir breakdowns (prefetch)
        ids = [a.id for a in activities if a.id is not None]
        qs = (
            SoftwareActivityModel.objects.filter(id__in=ids)
            .prefetch_related("beneficiary_breakdowns")
            .order_by("-id")
        )
        data = SoftwareActivitySerializer(qs, many=True).data
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = SoftwareActivitySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        activity = serializer.save()
        return Response(
            {"id": activity.id, "message": "Actividad creada"},
            status=status.HTTP_201_CREATED,
        )


class SoftwareActivityImportExcelAPIView(AuditedAPIView):
    permission_classes = [IsAuthenticated, HasModulePermission]
    required_module = "software_activities"
    required_action = "create"

    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file = request.FILES.get("file")
        if not file:
            return Response(
                {"detail": "Debes enviar el archivo en el campo 'file'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        use_case = ImportSoftwareActivitiesFromExcelUseCase(
            repository=SoftwareActivityRepositoryDjango()
        )
        result = use_case.execute(file_obj=file)
        return Response(
            {"created": result.created, "skipped_empty_rows": result.skipped_empty_rows},
            status=status.HTTP_201_CREATED,
        )


class SoftwareActivityExportExcelAPIView(AuditedAPIView):
    permission_classes = [IsAuthenticated, HasModulePermission]
    required_module = "software_activities"
    required_action = "view"

    def get(self, request):
        use_case = ExportSoftwareActivitiesToExcelUseCase(
            repository=SoftwareActivityRepositoryDjango()
        )
        result = use_case.execute(limit=5000, offset=0)
        resp = HttpResponse(result.data, content_type=result.content_type)
        resp["Content-Disposition"] = f'attachment; filename="{result.filename}"'
        return resp
