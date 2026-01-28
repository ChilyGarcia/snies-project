from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from audit.presentation.audited_api_view import AuditedAPIView

from continuing_education_beneficiaries.application.use_cases.create_continuing_education_beneficiary import (
    CreateContinuingEducationBeneficiaryUseCase,
)
from continuing_education_beneficiaries.application.use_cases.delete_continuing_education_beneficiary import (
    DeleteContinuingEducationBeneficiaryUseCase,
)
from continuing_education_beneficiaries.application.use_cases.get_continuing_education_beneficiary import (
    GetContinuingEducationBeneficiaryUseCase,
)
from continuing_education_beneficiaries.application.use_cases.list_continuing_education_beneficiaries import (
    ListContinuingEducationBeneficiariesUseCase,
)
from continuing_education_beneficiaries.application.use_cases.update_continuing_education_beneficiary import (
    UpdateContinuingEducationBeneficiaryUseCase,
)
from continuing_education_beneficiaries.domain.entities.continuing_education_beneficiary import (
    ContinuingEducationBeneficiary,
)
from continuing_education_beneficiaries.infraestructure.persistence.django.continuing_education_beneficiary_repository import (
    ContinuingEducationBeneficiaryRepositoryDjango,
)
from continuing_education_beneficiaries.presentation.api.continuing_education_beneficiaries.serializers import (
    ContinuingEducationBeneficiarySerializer,
)
from users.presentation.permissions import HasModulePermission


class ContinuingEducationBeneficiaryCreateAPIView(AuditedAPIView):
    permission_classes = [IsAuthenticated, HasModulePermission]
    required_module = "continuing_education"
    required_action = "create"

    def post(self, request):
        serializer = ContinuingEducationBeneficiarySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        beneficiary = ContinuingEducationBeneficiary(
            id=None,
            year=serializer.validated_data["year"],
            semester=serializer.validated_data["semester"],
            course_code=serializer.validated_data["course_code"],
            beneficiary_type_extension_id=serializer.validated_data[
                "beneficiary_type_extension_id"
            ],
            beneficiaries_count=serializer.validated_data["beneficiaries_count"],
        )
        use_case = CreateContinuingEducationBeneficiaryUseCase(
            repository=ContinuingEducationBeneficiaryRepositoryDjango()
        )
        created = use_case.execute(beneficiary)
        return Response(
            {"id": created.id, "message": "Continuing education beneficiary created successfully"},
            status=status.HTTP_201_CREATED,
        )


class ContinuingEducationBeneficiaryListAPIView(AuditedAPIView):
    permission_classes = [IsAuthenticated, HasModulePermission]
    required_module = "continuing_education"
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
                    {"error": "semester must be an integer"}, status=status.HTTP_400_BAD_REQUEST
                )

        use_case = ListContinuingEducationBeneficiariesUseCase(
            repository=ContinuingEducationBeneficiaryRepositoryDjango()
        )
        beneficiaries = use_case.execute(year=year, semester=semester)
        data = [
            {
                "id": b.id,
                "year": b.year,
                "semester": b.semester,
                "course_code": b.course_code,
                "beneficiary_type_extension_id": b.beneficiary_type_extension_id,
                "beneficiaries_count": b.beneficiaries_count,
            }
            for b in beneficiaries
        ]
        return Response(data, status=status.HTTP_200_OK)


class ContinuingEducationBeneficiaryDetailAPIView(AuditedAPIView):
    permission_classes = [IsAuthenticated, HasModulePermission]
    required_module = "continuing_education"
    required_action = "view"

    def get(self, request, id: int):
        use_case = GetContinuingEducationBeneficiaryUseCase(
            repository=ContinuingEducationBeneficiaryRepositoryDjango()
        )
        b = use_case.execute(id)
        return Response(
            {
                "id": b.id,
                "year": b.year,
                "semester": b.semester,
                "course_code": b.course_code,
                "beneficiary_type_extension_id": b.beneficiary_type_extension_id,
                "beneficiaries_count": b.beneficiaries_count,
            },
            status=status.HTTP_200_OK,
        )

    def put(self, request, id: int):
        self.required_action = "edit"
        serializer = ContinuingEducationBeneficiarySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        beneficiary = ContinuingEducationBeneficiary(
            id=id,
            year=serializer.validated_data["year"],
            semester=serializer.validated_data["semester"],
            course_code=serializer.validated_data["course_code"],
            beneficiary_type_extension_id=serializer.validated_data[
                "beneficiary_type_extension_id"
            ],
            beneficiaries_count=serializer.validated_data["beneficiaries_count"],
        )
        use_case = UpdateContinuingEducationBeneficiaryUseCase(
            repository=ContinuingEducationBeneficiaryRepositoryDjango()
        )
        updated = use_case.execute(id, beneficiary)
        return Response(
            {"id": updated.id, "message": "Continuing education beneficiary updated successfully"},
            status=status.HTTP_200_OK,
        )

    def delete(self, request, id: int):
        self.required_action = "delete"
        use_case = DeleteContinuingEducationBeneficiaryUseCase(
            repository=ContinuingEducationBeneficiaryRepositoryDjango()
        )
        use_case.execute(id)
        return Response(status=status.HTTP_204_NO_CONTENT)

