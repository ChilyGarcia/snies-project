from django.urls import path
from .views import CourseCreateAPIView, CourseListAPIView

urlpatterns = [
    path("", CourseListAPIView.as_view()),
    path("create/", CourseCreateAPIView.as_view()),
]
