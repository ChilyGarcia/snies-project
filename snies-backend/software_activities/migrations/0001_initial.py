from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="SoftwareActivityModel",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("year", models.IntegerField()),
                ("semester", models.IntegerField()),
                ("start_date", models.DateField(blank=True, null=True)),
                ("end_date", models.DateField(blank=True, null=True)),
                ("execution_place", models.CharField(max_length=255)),
                ("campus", models.CharField(max_length=32)),
                ("activity_name", models.CharField(max_length=500)),
                ("agreement_entity", models.CharField(blank=True, max_length=255, null=True)),
                ("description", models.TextField(blank=True, null=True)),
                ("cine_isced_name", models.CharField(blank=True, max_length=255, null=True)),
                ("cine_field_detailed_id", models.CharField(blank=True, max_length=32, null=True)),
                ("num_hours", models.IntegerField(blank=True, null=True)),
                ("activity_type", models.CharField(blank=True, max_length=128, null=True)),
                ("course_value", models.DecimalField(blank=True, decimal_places=2, max_digits=14, null=True)),
                ("teacher_document_type", models.CharField(blank=True, max_length=128, null=True)),
                ("teacher_document_number", models.CharField(blank=True, max_length=64, null=True)),
                ("total_beneficiaries", models.IntegerField(blank=True, null=True)),
                ("professors_count", models.IntegerField(blank=True, null=True)),
                ("administrative_count", models.IntegerField(blank=True, null=True)),
                ("external_people_count", models.IntegerField(blank=True, null=True)),
                ("speaker_full_name", models.CharField(blank=True, max_length=255, null=True)),
                ("speaker_origin", models.CharField(blank=True, max_length=255, null=True)),
                ("speaker_company", models.CharField(blank=True, max_length=255, null=True)),
                ("consultancy_entity_name", models.CharField(blank=True, max_length=255, null=True)),
                ("consultancy_sector_id", models.CharField(blank=True, max_length=64, null=True)),
                ("consultancy_value", models.DecimalField(blank=True, decimal_places=2, max_digits=14, null=True)),
                ("evidence_event_planning", models.BooleanField(default=False)),
                ("evidence_event_planning_file", models.FileField(blank=True, null=True, upload_to="evidences/software/event_planning/")),
                ("evidence_attendance_control", models.BooleanField(default=False)),
                ("evidence_attendance_control_file", models.FileField(blank=True, null=True, upload_to="evidences/software/attendance_control/")),
                ("evidence_program_design_guide", models.BooleanField(default=False)),
                ("evidence_program_design_guide_file", models.FileField(blank=True, null=True, upload_to="evidences/software/program_design_guide/")),
                ("evidence_audiovisual_record", models.BooleanField(default=False)),
                ("evidence_audiovisual_record_file", models.FileField(blank=True, null=True, upload_to="evidences/software/audiovisual_record/")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={"db_table": "software_activities"},
        ),
        migrations.CreateModel(
            name="SoftwareActivityBeneficiaryBreakdownModel",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("population", models.CharField(max_length=32)),
                ("campus", models.CharField(max_length=32)),
                ("program", models.CharField(max_length=255)),
                ("level", models.CharField(max_length=32)),
                ("count", models.IntegerField()),
                (
                    "activity",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="beneficiary_breakdowns",
                        to="software_activities.softwareactivitymodel",
                    ),
                ),
            ],
            options={"db_table": "software_activity_beneficiary_breakdowns"},
        ),
    ]

