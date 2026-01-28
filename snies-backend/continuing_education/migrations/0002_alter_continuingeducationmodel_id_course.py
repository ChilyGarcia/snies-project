                                               

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("continuing_education", "0001_initial"),
        ("courses", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="continuingeducationmodel",
            name="id_course",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="courses.coursemodel"
            ),
        ),
    ]
