from audit.presentation.audited_api_view import AuditedAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from continuing_education.presentation.api.continuing_education.serializers import ContinuingEducationSerializer
from continuing_education.domain.entities.continuing_education import ContinuingEducation
from continuing_education.application.use_cases.create_continuing_education import CreateContinuingEducationUseCase
from continuing_education.application.use_cases.list_continuing_education import ListContinuingEducationUseCase
from continuing_education.infraestructure.persistence.django.continuing_education_repository import ContinuingEducationRepositoryDjango
from courses.infraestructure.persistence.django.course_repository import CourseRepositoryDjango
from continuing_education.domain.exceptions.domain_exception import DomainException
from users.presentation.permissions import HasModulePermission

class ContinuingEducationCreateAPIView(AuditedAPIView):
    permission_classes = [IsAuthenticated, HasModulePermission]
    required_module = "continuing_education"
    required_action = "create"
    def post(self, request):
        serializer = ContinuingEducationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        continuing_education = ContinuingEducation(
            id=None,
            year=serializer.validated_data["year"],
            semester=serializer.validated_data["semester"],
            num_hours=serializer.validated_data["num_hours"],
            id_course=serializer.validated_data["id_course"],
            value=serializer.validated_data["value"],
        )
        use_case = CreateContinuingEducationUseCase(continuing_education_repository=ContinuingEducationRepositoryDjango(), course_repository=CourseRepositoryDjango())
        created_continuing_education = use_case.execute(continuing_education)
        return Response({"id": created_continuing_education.id, "message": "Continuing education created successfully"}, status=status.HTTP_201_CREATED)


class ContinuingEducationListAPIView(AuditedAPIView):
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
                    {"error": "semester must be an integer"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        use_case = ListContinuingEducationUseCase(
            continuing_education_repository=ContinuingEducationRepositoryDjango()
        )
        items = use_case.execute(year=year, semester=semester)
        data = [
            {
                "id": ce.id,
                "year": ce.year,
                "semester": ce.semester,
                "num_hours": ce.num_hours,
                "id_course": ce.id_course,
                "value": ce.value,
            }
            for ce in items
        ]
        return Response(data, status=status.HTTP_200_OK)
