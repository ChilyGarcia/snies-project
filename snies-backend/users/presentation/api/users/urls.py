from django.urls import path
from .views import UserCreateAPIView, UserMeAPIView, UserMePermissionsAPIView, UserListAPIView

urlpatterns = [
    path("", UserListAPIView.as_view()),
    path("create/", UserCreateAPIView.as_view()),
    path("me/", UserMeAPIView.as_view()),
    path("me/permissions/", UserMePermissionsAPIView.as_view()),
]
