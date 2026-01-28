from rest_framework import serializers

from continuing_education_beneficiaries.infraestructure.persistence.django.models import (
    ContinuingEducationBeneficiaryModel,
)


class ContinuingEducationBeneficiarySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContinuingEducationBeneficiaryModel
        fields = "__all__"

