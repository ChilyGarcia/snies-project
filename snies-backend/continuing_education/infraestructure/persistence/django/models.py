from django.db import models

class ContinuingEducationModel(models.Model):
    id = models.AutoField(primary_key=True)
    year = models.CharField(max_length=4)
    semester = models.IntegerField()
    num_hours = models.IntegerField()
    id_course = models.ForeignKey("courses.CourseModel", on_delete=models.CASCADE)
    value = models.IntegerField()

    class Meta:
        db_table = "continuing_education"
