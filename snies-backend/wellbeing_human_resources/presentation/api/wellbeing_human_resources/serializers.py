from rest_framework import serializers

from wellbeing_human_resources.infraestructure.persistence.django.models import (
    WellbeingHumanResourceModel,
)


class WellbeingHumanResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = WellbeingHumanResourceModel
        fields = "__all__"

