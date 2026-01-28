from django.db import models


class ContinuingEducationTeacherModel(models.Model):
    id = models.AutoField(primary_key=True)
    year = models.CharField(max_length=4)
    semester = models.IntegerField()
    course_code = models.CharField(max_length=6)
    document_type_id = models.IntegerField()
    document_number = models.CharField(max_length=50)

    class Meta:
        db_table = "continuing_education_teachers"
        unique_together = ("year", "semester", "course_code", "document_type_id", "document_number")

