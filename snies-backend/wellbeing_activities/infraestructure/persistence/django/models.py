from django.db import models


class WellbeingActivityModel(models.Model):
    id = models.AutoField(primary_key=True)
    year = models.CharField(max_length=4)
    semester = models.IntegerField()
    organization_unit_code = models.CharField(max_length=50)
    activity_code = models.CharField(max_length=50)
    activity_description = models.TextField()
    wellbeing_activity_type_id = models.IntegerField()
    start_date = models.DateField()
    end_date = models.DateField()
    national_source_id = models.IntegerField()
    national_funding_value = models.DecimalField(max_digits=18, decimal_places=2)
    funding_country_id = models.IntegerField()
    international_source_entity_name = models.CharField(
        max_length=255, null=True, blank=True
    )
    international_funding_value = models.DecimalField(
        max_digits=18, decimal_places=2, null=True, blank=True
    )

    class Meta:
        db_table = "actividades_bienestar"

