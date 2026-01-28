from rest_framework import serializers
from continuing_education.infraestructure.persistence.django.models import ContinuingEducationModel

class ContinuingEducationSerializer(serializers.ModelSerializer):
    id_course = serializers.IntegerField()
    class Meta:
        model = ContinuingEducationModel
        fields = '__all__'