from rest_framework import serializers


class CreateRoleSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=50)
    description = serializers.CharField(max_length=255, required=False, allow_null=True, allow_blank=True)


class SetRolePermissionsSerializer(serializers.Serializer):
    module = serializers.ChoiceField(choices=["courses", "wellbeing"])
    can_view = serializers.BooleanField()
    can_create = serializers.BooleanField()
    can_edit = serializers.BooleanField()
    can_delete = serializers.BooleanField()


class AssignRoleSerializer(serializers.Serializer):
    role_id = serializers.IntegerField()

