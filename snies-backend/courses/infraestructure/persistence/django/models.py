from django.db import models

class CourseModel(models.Model):
    id = models.AutoField(primary_key=True)
    code = models.CharField(max_length=6)
    name = models.CharField(max_length=100)
    id_cine_field_detailed = models.CharField(max_length=6)
    is_extension = models.BooleanField()
    is_active = models.BooleanField()

    class Meta:
        db_table = "courses"