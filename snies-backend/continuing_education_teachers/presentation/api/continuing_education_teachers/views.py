from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from audit.presentation.audited_api_view import AuditedAPIView

from continuing_education_teachers.application.use_cases.create_continuing_education_teacher import (
    CreateContinuingEducationTeacherUseCase,
)
from continuing_education_teachers.application.use_cases.delete_continuing_education_teacher import (
    DeleteContinuingEducationTeacherUseCase,
)
from continuing_education_teachers.application.use_cases.get_continuing_education_teacher import (
    GetContinuingEducationTeacherUseCase,
)
from continuing_education_teachers.application.use_cases.list_continuing_education_teachers import (
    ListContinuingEducationTeachersUseCase,
)
from continuing_education_teachers.application.use_cases.update_continuing_education_teacher import (
    UpdateContinuingEducationTeacherUseCase,
)
from continuing_education_teachers.domain.entities.continuing_education_teacher import (
    ContinuingEducationTeacher,
)
from continuing_education_teachers.infraestructure.persistence.django.continuing_education_teacher_repository import (
    ContinuingEducationTeacherRepositoryDjango,
)
from continuing_education_teachers.presentation.api.continuing_education_teachers.serializers import (
    ContinuingEducationTeacherSerializer,
)
from users.presentation.permissions import HasModulePermission


class ContinuingEducationTeacherCreateAPIView(AuditedAPIView):
    permission_classes = [IsAuthenticated, HasModulePermission]
    required_module = "continuing_education"
    required_action = "create"

    def post(self, request):
        serializer = ContinuingEducationTeacherSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        teacher = ContinuingEducationTeacher(
            id=None,
            year=serializer.validated_data["year"],
            semester=serializer.validated_data["semester"],
            course_code=serializer.validated_data["course_code"],
            document_type_id=serializer.validated_data["document_type_id"],
            document_number=serializer.validated_data["document_number"],
        )
        use_case = CreateContinuingEducationTeacherUseCase(
            repository=ContinuingEducationTeacherRepositoryDjango()
        )
        created = use_case.execute(teacher)
        return Response(
            {"id": created.id, "message": "Continuing education teacher created successfully"},
            status=status.HTTP_201_CREATED,
        )


class ContinuingEducationTeacherListAPIView(AuditedAPIView):
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
                return Response({"error": "semester must be an integer"}, status=status.HTTP_400_BAD_REQUEST)

        use_case = ListContinuingEducationTeachersUseCase(
            repository=ContinuingEducationTeacherRepositoryDjango()
        )
        teachers = use_case.execute(year=year, semester=semester)
        data = [
            {
                "id": t.id,
                "year": t.year,
                "semester": t.semester,
                "course_code": t.course_code,
                "document_type_id": t.document_type_id,
                "document_number": t.document_number,
            }
            for t in teachers
        ]
        return Response(data, status=status.HTTP_200_OK)


class ContinuingEducationTeacherDetailAPIView(AuditedAPIView):
    permission_classes = [IsAuthenticated, HasModulePermission]
    required_module = "continuing_education"
    required_action = "view"

    def get(self, request, id: int):
        use_case = GetContinuingEducationTeacherUseCase(
            repository=ContinuingEducationTeacherRepositoryDjango()
        )
        teacher = use_case.execute(id)
        return Response(
            {
                "id": teacher.id,
                "year": teacher.year,
                "semester": teacher.semester,
                "course_code": teacher.course_code,
                "document_type_id": teacher.document_type_id,
                "document_number": teacher.document_number,
            },
            status=status.HTTP_200_OK,
        )

    def put(self, request, id: int):
        self.required_action = "edit"
        serializer = ContinuingEducationTeacherSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        teacher = ContinuingEducationTeacher(
            id=id,
            year=serializer.validated_data["year"],
            semester=serializer.validated_data["semester"],
            course_code=serializer.validated_data["course_code"],
            document_type_id=serializer.validated_data["document_type_id"],
            document_number=serializer.validated_data["document_number"],
        )
        use_case = UpdateContinuingEducationTeacherUseCase(
            repository=ContinuingEducationTeacherRepositoryDjango()
        )
        updated = use_case.execute(id, teacher)
        return Response(
            {"id": updated.id, "message": "Continuing education teacher updated successfully"},
            status=status.HTTP_200_OK,
        )

    def delete(self, request, id: int):
        self.required_action = "delete"
        use_case = DeleteContinuingEducationTeacherUseCase(
            repository=ContinuingEducationTeacherRepositoryDjango()
        )
        use_case.execute(id)
        return Response(status=status.HTTP_204_NO_CONTENT)

