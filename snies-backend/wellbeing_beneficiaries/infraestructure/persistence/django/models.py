from django.db import models


class WellbeingBeneficiaryActivityModel(models.Model):
    id = models.AutoField(primary_key=True)
    year = models.CharField(max_length=4)
    semester = models.IntegerField()
    organization_unit_code = models.CharField(max_length=50)
    activity_code = models.CharField(max_length=50)
    beneficiary_type_id = models.IntegerField()
    beneficiaries_count = models.IntegerField()

    class Meta:
        db_table = "actividad_bienestar_beneficiarios"

