                                               

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="CourseModel",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("code", models.CharField(max_length=6)),
                ("name", models.CharField(max_length=100)),
                ("id_cine_field_detailed", models.CharField(max_length=6)),
                ("is_extension", models.BooleanField()),
                ("is_active", models.BooleanField()),
            ],
        ),
    ]
