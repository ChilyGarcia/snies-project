from django.db import models


class ContinuingEducationBeneficiaryModel(models.Model):
    id = models.AutoField(primary_key=True)
    year = models.CharField(max_length=4)
    semester = models.IntegerField()
    course_code = models.CharField(max_length=6)
    beneficiary_type_extension_id = models.IntegerField()
    beneficiaries_count = models.IntegerField()

    class Meta:
        db_table = "continuing_education_beneficiaries"
        unique_together = (
            "year",
            "semester",
            "course_code",
            "beneficiary_type_extension_id",
        )

