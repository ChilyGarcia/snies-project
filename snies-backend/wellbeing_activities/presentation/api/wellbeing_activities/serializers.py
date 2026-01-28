from rest_framework import serializers

from wellbeing_activities.infraestructure.persistence.django.models import (
    WellbeingActivityModel,
)


class WellbeingActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = WellbeingActivityModel
        fields = "__all__"

