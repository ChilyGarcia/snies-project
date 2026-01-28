from rest_framework import serializers

from wellbeing_beneficiaries.infraestructure.persistence.django.models import (
    WellbeingBeneficiaryActivityModel,
)


class WellbeingBeneficiaryActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = WellbeingBeneficiaryActivityModel
        fields = "__all__"

