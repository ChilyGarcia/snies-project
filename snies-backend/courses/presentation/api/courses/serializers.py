from rest_framework import serializers
from courses.infraestructure.persistence.django.models import CourseModel


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseModel
        fields = '__all__'