from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer
from users.application.use_cases.create_user import CreateUserUseCase
from users.infraestructure.persistence.django.user_repository import (
    DjangoUserRepository,
)
from users.domain.entities.users import User
from users.domain.exceptions.user_exception import InvalidUserException


class RegisterAPIView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        use_case = CreateUserUseCase(user_repository=DjangoUserRepository())

        try:
            user = User(
                id=None,
                name=serializer.validated_data["name"],
                email=serializer.validated_data["email"],
                password=serializer.validated_data["password"],
            )
            created_user = use_case.execute(user)
            return Response(
                {"id": created_user.id, "message": "User registered successfully"},
                status=status.HTTP_201_CREATED,
            )
        except InvalidUserException as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
