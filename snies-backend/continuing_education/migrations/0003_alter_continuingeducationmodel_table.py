                                               

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("continuing_education", "0002_alter_continuingeducationmodel_id_course"),
    ]

    operations = [
        migrations.AlterModelTable(
            name="continuingeducationmodel",
            table="continuing_education",
        ),
    ]
