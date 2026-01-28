from django.db import models


class AuditLogModel(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)

    action = models.CharField(max_length=20)
    method = models.CharField(max_length=10)
    path = models.TextField()
    status_code = models.IntegerField()

    user_id = models.IntegerField(null=True, blank=True)
    user_email = models.CharField(max_length=254, null=True, blank=True)
    user_role = models.CharField(max_length=50, null=True, blank=True)

    ip = models.CharField(max_length=45, null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    view_name = models.CharField(max_length=255, null=True, blank=True)
    module = models.CharField(max_length=64, null=True, blank=True)
    resource_id = models.CharField(max_length=64, null=True, blank=True)

    request_data = models.JSONField(null=True, blank=True)
    response_data = models.JSONField(null=True, blank=True)

    class Meta:
        db_table = "audit_logs"
        indexes = [
            models.Index(fields=["created_at"]),
            models.Index(fields=["user_id"]),
            models.Index(fields=["module"]),
            models.Index(fields=["action"]),
        ]

