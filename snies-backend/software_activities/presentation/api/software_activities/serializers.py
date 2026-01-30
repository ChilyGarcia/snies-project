from __future__ import annotations

from rest_framework import serializers

from software_activities.infraestructure.persistence.django.models import (
    SoftwareActivityModel,
    SoftwareActivityBeneficiaryBreakdownModel,
)


class BeneficiaryBreakdownSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoftwareActivityBeneficiaryBreakdownModel
        fields = ["population", "campus", "program", "level", "count"]


class SoftwareActivitySerializer(serializers.ModelSerializer):
    beneficiary_breakdowns = BeneficiaryBreakdownSerializer(
        many=True, required=False
    )

    class Meta:
        model = SoftwareActivityModel
        fields = [
            "id",
            "career",
            "year",
            "semester",
            "start_date",
            "end_date",
            "execution_place",
            "campus",
            "activity_name",
            "agreement_entity",
            "description",
            "cine_isced_name",
            "cine_field_detailed_id",
            "num_hours",
            "activity_type",
            "course_value",
            "teacher_document_type",
            "teacher_document_number",
            "total_beneficiaries",
            "professors_count",
            "administrative_count",
            "external_people_count",
            "speaker_full_name",
            "speaker_origin",
            "speaker_company",
            "consultancy_entity_name",
            "consultancy_sector_id",
            "consultancy_value",
            "evidence_event_planning",
            "evidence_event_planning_file",
            "evidence_attendance_control",
            "evidence_attendance_control_file",
            "evidence_program_design_guide",
            "evidence_program_design_guide_file",
            "evidence_audiovisual_record",
            "evidence_audiovisual_record_file",
            "created_at",
            "beneficiary_breakdowns",
        ]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        breakdowns = validated_data.pop("beneficiary_breakdowns", [])
        activity = SoftwareActivityModel.objects.create(**validated_data)
        if breakdowns:
            SoftwareActivityBeneficiaryBreakdownModel.objects.bulk_create(
                [
                    SoftwareActivityBeneficiaryBreakdownModel(
                        activity=activity, **b
                    )
                    for b in breakdowns
                ]
            )
        return activity
