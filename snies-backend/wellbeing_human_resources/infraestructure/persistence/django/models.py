from django.db import models


class WellbeingHumanResourceModel(models.Model):
    id = models.AutoField(primary_key=True)
    year = models.CharField(max_length=4)
    semester = models.IntegerField()
    activity_code = models.CharField(max_length=50)
    organization_unit_code = models.CharField(max_length=50)
    document_type_id = models.IntegerField()
    document_number = models.CharField(max_length=50)
    dedication = models.CharField(max_length=50)

    class Meta:
        db_table = "bienestar_recursos_humanos"
        unique_together = (
            "year",
            "semester",
            "activity_code",
            "organization_unit_code",
            "document_type_id",
            "document_number",
        )

