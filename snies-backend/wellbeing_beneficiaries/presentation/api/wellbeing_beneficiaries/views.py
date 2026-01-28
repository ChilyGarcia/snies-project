from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from audit.presentation.audited_api_view import AuditedAPIView

from wellbeing_beneficiaries.application.use_cases.create_wellbeing_beneficiary_activity import (
    CreateWellbeingBeneficiaryActivityUseCase,
)
from wellbeing_beneficiaries.application.use_cases.delete_wellbeing_beneficiary_activity import (
    DeleteWellbeingBeneficiaryActivityUseCase,
)
from wellbeing_beneficiaries.application.use_cases.get_wellbeing_beneficiary_activity import (
    GetWellbeingBeneficiaryActivityUseCase,
)
from wellbeing_beneficiaries.application.use_cases.list_wellbeing_beneficiary_activities import (
    ListWellbeingBeneficiaryActivitiesUseCase,
)
from wellbeing_beneficiaries.application.use_cases.update_wellbeing_beneficiary_activity import (
    UpdateWellbeingBeneficiaryActivityUseCase,
)
from wellbeing_beneficiaries.domain.entities.wellbeing_beneficiary_activity import (
    WellbeingBeneficiaryActivity,
)
from wellbeing_beneficiaries.infraestructure.persistence.django.wellbeing_beneficiary_activity_repository import (
    WellbeingBeneficiaryActivityRepositoryDjango,
)
from wellbeing_beneficiaries.presentation.api.wellbeing_beneficiaries.serializers import (
    WellbeingBeneficiaryActivitySerializer,
)
from users.presentation.permissions import HasModulePermission


class WellbeingBeneficiaryActivityCreateAPIView(AuditedAPIView):
    permission_classes = [IsAuthenticated, HasModulePermission]
    required_module = "wellbeing"
    required_action = "create"

    def post(self, request):
        serializer = WellbeingBeneficiaryActivitySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        activity = WellbeingBeneficiaryActivity(
            id=None,
            year=serializer.validated_data["year"],
            semester=serializer.validated_data["semester"],
            organization_unit_code=serializer.validated_data["organization_unit_code"],
            activity_code=serializer.validated_data["activity_code"],
            beneficiary_type_id=serializer.validated_data["beneficiary_type_id"],
            beneficiaries_count=serializer.validated_data["beneficiaries_count"],
        )

        use_case = CreateWellbeingBeneficiaryActivityUseCase(
            repository=WellbeingBeneficiaryActivityRepositoryDjango()
        )
        created = use_case.execute(activity)
        return Response(
            {
                "id": created.id,
                "message": "Wellbeing beneficiary activity created successfully",
            },
            status=status.HTTP_201_CREATED,
        )


class WellbeingBeneficiaryActivityListAPIView(AuditedAPIView):
    permission_classes = [IsAuthenticated, HasModulePermission]
    required_module = "wellbeing"
    required_action = "view"

    def get(self, request):
        use_case = ListWellbeingBeneficiaryActivitiesUseCase(
            repository=WellbeingBeneficiaryActivityRepositoryDjango()
        )
        activities = use_case.execute()
        data = [
            {
                "id": a.id,
                "year": a.year,
                "semester": a.semester,
                "organization_unit_code": a.organization_unit_code,
                "activity_code": a.activity_code,
                "beneficiary_type_id": a.beneficiary_type_id,
                "beneficiaries_count": a.beneficiaries_count,
            }
            for a in activities
        ]
        return Response(data, status=status.HTTP_200_OK)


class WellbeingBeneficiaryActivityDetailAPIView(AuditedAPIView):
    permission_classes = [IsAuthenticated, HasModulePermission]
    required_module = "wellbeing"
    required_action = "view"

    def get(self, request, id: int):
        use_case = GetWellbeingBeneficiaryActivityUseCase(
            repository=WellbeingBeneficiaryActivityRepositoryDjango()
        )
        activity = use_case.execute(id)
        if not activity:
            return Response(
                {"message": "Wellbeing beneficiary activity not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(
            {
                "id": activity.id,
                "year": activity.year,
                "semester": activity.semester,
                "organization_unit_code": activity.organization_unit_code,
                "activity_code": activity.activity_code,
                "beneficiary_type_id": activity.beneficiary_type_id,
                "beneficiaries_count": activity.beneficiaries_count,
            },
            status=status.HTTP_200_OK,
        )

    def put(self, request, id: int):
        self.required_action = "edit"
        serializer = WellbeingBeneficiaryActivitySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        activity = WellbeingBeneficiaryActivity(
            id=id,
            year=serializer.validated_data["year"],
            semester=serializer.validated_data["semester"],
            organization_unit_code=serializer.validated_data["organization_unit_code"],
            activity_code=serializer.validated_data["activity_code"],
            beneficiary_type_id=serializer.validated_data["beneficiary_type_id"],
            beneficiaries_count=serializer.validated_data["beneficiaries_count"],
        )

        use_case = UpdateWellbeingBeneficiaryActivityUseCase(
            repository=WellbeingBeneficiaryActivityRepositoryDjango()
        )
        updated = use_case.execute(id, activity)
        if not updated:
            return Response(
                {"message": "Wellbeing beneficiary activity not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(
            {
                "id": updated.id,
                "message": "Wellbeing beneficiary activity updated successfully",
            },
            status=status.HTTP_200_OK,
        )

    def delete(self, request, id: int):
        self.required_action = "delete"
        use_case = DeleteWellbeingBeneficiaryActivityUseCase(
            repository=WellbeingBeneficiaryActivityRepositoryDjango()
        )
        deleted = use_case.execute(id)
        if not deleted:
            return Response(
                {"message": "Wellbeing beneficiary activity not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)

