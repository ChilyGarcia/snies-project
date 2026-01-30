from django.db import models


class SoftwareActivityModel(models.Model):
    id = models.AutoField(primary_key=True)

    # Carrera / programa al que pertenece la actividad (tag para filtrado)
    career = models.CharField(max_length=64, null=True, blank=True)

    year = models.IntegerField()
    semester = models.IntegerField()

    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    execution_place = models.CharField(max_length=255)
    campus = models.CharField(max_length=32)  # CÚCUTA / OCAÑA (texto libre)

    activity_name = models.CharField(max_length=500)
    agreement_entity = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)

    cine_isced_name = models.CharField(max_length=255, null=True, blank=True)
    cine_field_detailed_id = models.CharField(max_length=32, null=True, blank=True)

    num_hours = models.IntegerField(null=True, blank=True)
    activity_type = models.CharField(max_length=128, null=True, blank=True)

    course_value = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)

    teacher_document_type = models.CharField(max_length=128, null=True, blank=True)
    teacher_document_number = models.CharField(max_length=64, null=True, blank=True)

    total_beneficiaries = models.IntegerField(null=True, blank=True)
    professors_count = models.IntegerField(null=True, blank=True)
    administrative_count = models.IntegerField(null=True, blank=True)
    external_people_count = models.IntegerField(null=True, blank=True)

    # Conferencista / ponente
    speaker_full_name = models.CharField(max_length=255, null=True, blank=True)
    speaker_origin = models.CharField(max_length=255, null=True, blank=True)
    speaker_company = models.CharField(max_length=255, null=True, blank=True)

    # Consultoría
    consultancy_entity_name = models.CharField(max_length=255, null=True, blank=True)
    consultancy_sector_id = models.CharField(max_length=64, null=True, blank=True)
    consultancy_value = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)

    # Evidencias (bool + archivo opcional)
    evidence_event_planning = models.BooleanField(default=False)
    evidence_event_planning_file = models.FileField(upload_to="evidences/software/event_planning/", null=True, blank=True)

    evidence_attendance_control = models.BooleanField(default=False)
    evidence_attendance_control_file = models.FileField(upload_to="evidences/software/attendance_control/", null=True, blank=True)

    evidence_program_design_guide = models.BooleanField(default=False)
    evidence_program_design_guide_file = models.FileField(upload_to="evidences/software/program_design_guide/", null=True, blank=True)

    evidence_audiovisual_record = models.BooleanField(default=False)
    evidence_audiovisual_record_file = models.FileField(upload_to="evidences/software/audiovisual_record/", null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "software_activities"


class SoftwareActivityBeneficiaryBreakdownModel(models.Model):
    id = models.AutoField(primary_key=True)
    activity = models.ForeignKey(
        SoftwareActivityModel,
        on_delete=models.CASCADE,
        related_name="beneficiary_breakdowns",
    )

    population = models.CharField(max_length=32)  # students|graduates
    campus = models.CharField(max_length=32)  # CÚCUTA|OCAÑA
    program = models.CharField(max_length=255)
    level = models.CharField(max_length=32)  # técnico|tecnólogo|profesional
    count = models.IntegerField()

    class Meta:
        db_table = "software_activity_beneficiary_breakdowns"

