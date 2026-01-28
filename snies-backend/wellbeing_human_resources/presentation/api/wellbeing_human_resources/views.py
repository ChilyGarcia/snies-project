from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from audit.presentation.audited_api_view import AuditedAPIView

from wellbeing_human_resources.application.use_cases.create_wellbeing_human_resource import (
    CreateWellbeingHumanResourceUseCase,
)
from wellbeing_human_resources.application.use_cases.delete_wellbeing_human_resource import (
    DeleteWellbeingHumanResourceUseCase,
)
from wellbeing_human_resources.application.use_cases.get_wellbeing_human_resource import (
    GetWellbeingHumanResourceUseCase,
)
from wellbeing_human_resources.application.use_cases.list_wellbeing_human_resources import (
    ListWellbeingHumanResourcesUseCase,
)
from wellbeing_human_resources.application.use_cases.update_wellbeing_human_resource import (
    UpdateWellbeingHumanResourceUseCase,
)
from wellbeing_human_resources.domain.entities.wellbeing_human_resource import (
    WellbeingHumanResource,
)
from wellbeing_human_resources.infraestructure.persistence.django.wellbeing_human_resource_repository import (
    WellbeingHumanResourceRepositoryDjango,
)
from wellbeing_human_resources.presentation.api.wellbeing_human_resources.serializers import (
    WellbeingHumanResourceSerializer,
)
from users.presentation.permissions import HasModulePermission


class WellbeingHumanResourceCreateAPIView(AuditedAPIView):
    permission_classes = [IsAuthenticated, HasModulePermission]
    required_module = "wellbeing"
    required_action = "create"

    def post(self, request):
        serializer = WellbeingHumanResourceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        item = WellbeingHumanResource(
            id=None,
            year=serializer.validated_data["year"],
            semester=serializer.validated_data["semester"],
            activity_code=serializer.validated_data["activity_code"],
            organization_unit_code=serializer.validated_data["organization_unit_code"],
            document_type_id=serializer.validated_data["document_type_id"],
            document_number=serializer.validated_data["document_number"],
            dedication=serializer.validated_data["dedication"],
        )
        use_case = CreateWellbeingHumanResourceUseCase(
            repository=WellbeingHumanResourceRepositoryDjango()
        )
        created = use_case.execute(item)
        return Response(
            {"id": created.id, "message": "Wellbeing human resource created successfully"},
            status=status.HTTP_201_CREATED,
        )


class WellbeingHumanResourceListAPIView(AuditedAPIView):
    permission_classes = [IsAuthenticated, HasModulePermission]
    required_module = "wellbeing"
    required_action = "view"

    def get(self, request):
        year = request.query_params.get("year")
        semester_raw = request.query_params.get("semester")
        semester = None
        if semester_raw is not None and semester_raw != "":
            try:
                semester = int(semester_raw)
            except ValueError:
                return Response(
                    {"error": "semester must be an integer"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        use_case = ListWellbeingHumanResourcesUseCase(
            repository=WellbeingHumanResourceRepositoryDjango()
        )
        items = use_case.execute(year=year, semester=semester)
        data = [
            {
                "id": i.id,
                "year": i.year,
                "semester": i.semester,
                "activity_code": i.activity_code,
                "organization_unit_code": i.organization_unit_code,
                "document_type_id": i.document_type_id,
                "document_number": i.document_number,
                "dedication": i.dedication,
            }
            for i in items
        ]
        return Response(data, status=status.HTTP_200_OK)


class WellbeingHumanResourceDetailAPIView(AuditedAPIView):
    permission_classes = [IsAuthenticated, HasModulePermission]
    required_module = "wellbeing"
    required_action = "view"

    def get(self, request, id: int):
        use_case = GetWellbeingHumanResourceUseCase(
            repository=WellbeingHumanResourceRepositoryDjango()
        )
        i = use_case.execute(id)
        return Response(
            {
                "id": i.id,
                "year": i.year,
                "semester": i.semester,
                "activity_code": i.activity_code,
                "organization_unit_code": i.organization_unit_code,
                "document_type_id": i.document_type_id,
                "document_number": i.document_number,
                "dedication": i.dedication,
            },
            status=status.HTTP_200_OK,
        )

    def put(self, request, id: int):
        self.required_action = "edit"
        serializer = WellbeingHumanResourceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        item = WellbeingHumanResource(
            id=id,
            year=serializer.validated_data["year"],
            semester=serializer.validated_data["semester"],
            activity_code=serializer.validated_data["activity_code"],
            organization_unit_code=serializer.validated_data["organization_unit_code"],
            document_type_id=serializer.validated_data["document_type_id"],
            document_number=serializer.validated_data["document_number"],
            dedication=serializer.validated_data["dedication"],
        )
        use_case = UpdateWellbeingHumanResourceUseCase(
            repository=WellbeingHumanResourceRepositoryDjango()
        )
        updated = use_case.execute(id, item)
        return Response(
            {"id": updated.id, "message": "Wellbeing human resource updated successfully"},
            status=status.HTTP_200_OK,
        )

    def delete(self, request, id: int):
        self.required_action = "delete"
        use_case = DeleteWellbeingHumanResourceUseCase(
            repository=WellbeingHumanResourceRepositoryDjango()
        )
        use_case.execute(id)
        return Response(status=status.HTTP_204_NO_CONTENT)

