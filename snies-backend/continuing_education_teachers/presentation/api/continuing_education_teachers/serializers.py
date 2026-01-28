from rest_framework import serializers

from continuing_education_teachers.infraestructure.persistence.django.models import (
    ContinuingEducationTeacherModel,
)


class ContinuingEducationTeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContinuingEducationTeacherModel
        fields = "__all__"

