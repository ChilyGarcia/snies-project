from audit.presentation.audited_api_view import AuditedAPIView
from rest_framework.response import Response
from rest_framework import status
from courses.presentation.api.courses.serializers import CourseSerializer
from courses.domain.entities.course import Course
from courses.application.use_cases.create_course import CreateCourseUseCase
from courses.application.use_cases.list_courses import ListCoursesUseCase
from courses.infraestructure.persistence.django.course_repository import CourseRepositoryDjango
from rest_framework.permissions import IsAuthenticated
from users.presentation.permissions import HasModulePermission

class CourseListAPIView(AuditedAPIView):
    permission_classes = [IsAuthenticated, HasModulePermission]
    required_module = "courses"
    required_action = "view"

    def get(self, request):
        use_case = ListCoursesUseCase(course_repository=CourseRepositoryDjango())
        courses = use_case.execute()
        data = [
            {
                "id": c.id,
                "code": c.code,
                "name": c.name,
                "id_cine_field_detailed": c.id_cine_field_detailed,
                "is_extension": c.is_extension,
                "is_active": c.is_active,
            }
            for c in courses
        ]
        return Response(data, status=status.HTTP_200_OK)

class CourseCreateAPIView(AuditedAPIView):
    permission_classes = [IsAuthenticated, HasModulePermission]
    required_module = "courses"
    required_action = "create"
    def post(self, request):
        serializer = CourseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        use_case = CreateCourseUseCase(course_repository=CourseRepositoryDjango())

        course = Course(
            id=None,
            name=serializer.validated_data["name"],
            code=serializer.validated_data["code"],
            id_cine_field_detailed=serializer.validated_data["id_cine_field_detailed"],
            is_extension=serializer.validated_data["is_extension"],
            is_active=serializer.validated_data["is_active"],
        )
        created_course = use_case.execute(course)
        return Response({"id": created_course.id, "message": "Course created successfully"}, status=status.HTTP_201_CREATED)

