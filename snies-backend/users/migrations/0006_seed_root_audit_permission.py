from django.db import migrations


def seed_root_audit_permission(apps, schema_editor):
    RoleModel = apps.get_model("users", "RoleModel")
    RolePermissionModel = apps.get_model("users", "RolePermissionModel")

    root = RoleModel.objects.filter(name="root").first()
    if not root:
        return

    RolePermissionModel.objects.update_or_create(
        role=root,
        module="audit",
        defaults={
            "can_view": True,
            "can_create": True,
            "can_edit": True,
            "can_delete": True,
        },
    )


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0005_alter_rolepermissionmodel_module"),
    ]

    operations = [
        migrations.RunPython(seed_root_audit_permission, reverse_code=migrations.RunPython.noop),
    ]

