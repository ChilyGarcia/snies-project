from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from audit.presentation.audited_api_view import AuditedAPIView

from wellbeing_activities.application.use_cases.create_wellbeing_activity import (
    CreateWellbeingActivityUseCase,
)
from wellbeing_activities.application.use_cases.delete_wellbeing_activity import (
    DeleteWellbeingActivityUseCase,
)
from wellbeing_activities.application.use_cases.get_wellbeing_activity import (
    GetWellbeingActivityUseCase,
)
from wellbeing_activities.application.use_cases.list_wellbeing_activities import (
    ListWellbeingActivitiesUseCase,
)
from wellbeing_activities.application.use_cases.update_wellbeing_activity import (
    UpdateWellbeingActivityUseCase,
)
from wellbeing_activities.domain.entities.wellbeing_activity import WellbeingActivity
from wellbeing_activities.infraestructure.persistence.django.wellbeing_activity_repository import (
    WellbeingActivityRepositoryDjango,
)
from wellbeing_activities.presentation.api.wellbeing_activities.serializers import (
    WellbeingActivitySerializer,
)
from users.presentation.permissions import HasModulePermission


class WellbeingActivityCreateAPIView(AuditedAPIView):
    permission_classes = [IsAuthenticated, HasModulePermission]
    required_module = "wellbeing"
    required_action = "create"

    def post(self, request):
        serializer = WellbeingActivitySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        activity = WellbeingActivity(
            id=None,
            year=serializer.validated_data["year"],
            semester=serializer.validated_data["semester"],
            organization_unit_code=serializer.validated_data["organization_unit_code"],
            activity_code=serializer.validated_data["activity_code"],
            activity_description=serializer.validated_data["activity_description"],
            wellbeing_activity_type_id=serializer.validated_data[
                "wellbeing_activity_type_id"
            ],
            start_date=serializer.validated_data["start_date"],
            end_date=serializer.validated_data["end_date"],
            national_source_id=serializer.validated_data["national_source_id"],
            national_funding_value=serializer.validated_data["national_funding_value"],
            funding_country_id=serializer.validated_data["funding_country_id"],
            international_source_entity_name=serializer.validated_data.get(
                "international_source_entity_name"
            ),
            international_funding_value=serializer.validated_data.get(
                "international_funding_value"
            ),
        )

        use_case = CreateWellbeingActivityUseCase(
            repository=WellbeingActivityRepositoryDjango()
        )
        created = use_case.execute(activity)
        return Response(
            {"id": created.id, "message": "Wellbeing activity created successfully"},
            status=status.HTTP_201_CREATED,
        )


class WellbeingActivityListAPIView(AuditedAPIView):
    permission_classes = [IsAuthenticated, HasModulePermission]
    required_module = "wellbeing"
    required_action = "view"

    def get(self, request):
        use_case = ListWellbeingActivitiesUseCase(
            repository=WellbeingActivityRepositoryDjango()
        )
        activities = use_case.execute()
        data = [
            {
                "id": a.id,
                "year": a.year,
                "semester": a.semester,
                "organization_unit_code": a.organization_unit_code,
                "activity_code": a.activity_code,
                "activity_description": a.activity_description,
                "wellbeing_activity_type_id": a.wellbeing_activity_type_id,
                "start_date": a.start_date,
                "end_date": a.end_date,
                "national_source_id": a.national_source_id,
                "national_funding_value": a.national_funding_value,
                "funding_country_id": a.funding_country_id,
                "international_source_entity_name": a.international_source_entity_name,
                "international_funding_value": a.international_funding_value,
            }
            for a in activities
        ]
        return Response(data, status=status.HTTP_200_OK)


class WellbeingActivityDetailAPIView(AuditedAPIView):
    permission_classes = [IsAuthenticated, HasModulePermission]
    required_module = "wellbeing"
    required_action = "view"

    def get(self, request, id: int):
        use_case = GetWellbeingActivityUseCase(
            repository=WellbeingActivityRepositoryDjango()
        )
        activity = use_case.execute(id)
        if not activity:
            return Response(
                {"message": "Wellbeing activity not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(
            {
                "id": activity.id,
                "year": activity.year,
                "semester": activity.semester,
                "organization_unit_code": activity.organization_unit_code,
                "activity_code": activity.activity_code,
                "activity_description": activity.activity_description,
                "wellbeing_activity_type_id": activity.wellbeing_activity_type_id,
                "start_date": activity.start_date,
                "end_date": activity.end_date,
                "national_source_id": activity.national_source_id,
                "national_funding_value": activity.national_funding_value,
                "funding_country_id": activity.funding_country_id,
                "international_source_entity_name": activity.international_source_entity_name,
                "international_funding_value": activity.international_funding_value,
            },
            status=status.HTTP_200_OK,
        )

    def put(self, request, id: int):
        self.required_action = "edit"
        serializer = WellbeingActivitySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        activity = WellbeingActivity(
            id=id,
            year=serializer.validated_data["year"],
            semester=serializer.validated_data["semester"],
            organization_unit_code=serializer.validated_data["organization_unit_code"],
            activity_code=serializer.validated_data["activity_code"],
            activity_description=serializer.validated_data["activity_description"],
            wellbeing_activity_type_id=serializer.validated_data[
                "wellbeing_activity_type_id"
            ],
            start_date=serializer.validated_data["start_date"],
            end_date=serializer.validated_data["end_date"],
            national_source_id=serializer.validated_data["national_source_id"],
            national_funding_value=serializer.validated_data["national_funding_value"],
            funding_country_id=serializer.validated_data["funding_country_id"],
            international_source_entity_name=serializer.validated_data.get(
                "international_source_entity_name"
            ),
            international_funding_value=serializer.validated_data.get(
                "international_funding_value"
            ),
        )

        use_case = UpdateWellbeingActivityUseCase(
            repository=WellbeingActivityRepositoryDjango()
        )
        updated = use_case.execute(id, activity)
        if not updated:
            return Response(
                {"message": "Wellbeing activity not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(
            {"id": updated.id, "message": "Wellbeing activity updated successfully"},
            status=status.HTTP_200_OK,
        )

    def delete(self, request, id: int):
        self.required_action = "delete"
        use_case = DeleteWellbeingActivityUseCase(
            repository=WellbeingActivityRepositoryDjango()
        )
        deleted = use_case.execute(id)
        if not deleted:
            return Response(
                {"message": "Wellbeing activity not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)

