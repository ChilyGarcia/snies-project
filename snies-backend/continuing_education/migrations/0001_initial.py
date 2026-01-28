                                               

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="ContinuingEducationModel",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("year", models.CharField(max_length=4)),
                ("semester", models.IntegerField()),
                ("num_hours", models.IntegerField()),
                ("id_course", models.IntegerField()),
                ("value", models.IntegerField()),
            ],
        ),
    ]
