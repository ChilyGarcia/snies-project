from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .managers import CustomUserManager


class RoleModel(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = "roles"
        app_label = "users"


class RolePermissionModel(models.Model):
    MODULE_COURSES = "courses"
    MODULE_WELLBEING = "wellbeing"
    MODULE_CONTINUING_EDUCATION = "continuing_education"
    MODULE_AUDIT = "audit"

    MODULE_CHOICES = [
        (MODULE_COURSES, "Cursos"),
        (MODULE_WELLBEING, "Bienestar"),
        (MODULE_CONTINUING_EDUCATION, "Educación continua"),
        (MODULE_AUDIT, "Auditoría"),
    ]

    role = models.ForeignKey(RoleModel, on_delete=models.CASCADE, related_name="permissions")
    module = models.CharField(max_length=32, choices=MODULE_CHOICES)
    can_view = models.BooleanField(default=False)
    can_create = models.BooleanField(default=False)
    can_edit = models.BooleanField(default=False)
    can_delete = models.BooleanField(default=False)

    class Meta:
        db_table = "role_permissions"
        app_label = "users"
        unique_together = ("role", "module")


class UserModel(AbstractBaseUser, PermissionsMixin):
    NAME_FIELD = "name"
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    role = models.ForeignKey(RoleModel, null=True, blank=True, on_delete=models.SET_NULL, related_name="users")

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    class Meta:
        db_table = "users"
        app_label = "users"
