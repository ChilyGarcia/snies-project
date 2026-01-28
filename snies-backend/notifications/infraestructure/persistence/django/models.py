from django.db import models


class NotificationModel(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)
    is_read = models.BooleanField(default=False)

    user_id = models.IntegerField()  # references users.UserModel.id

    title = models.CharField(max_length=200)
    message = models.TextField()
    module = models.CharField(max_length=64, null=True, blank=True)
    action = models.CharField(max_length=32, null=True, blank=True)
    resource_id = models.CharField(max_length=64, null=True, blank=True)
    level = models.CharField(max_length=16, null=True, blank=True)

    class Meta:
        db_table = "notifications"
        indexes = [
            models.Index(fields=["user_id", "is_read", "created_at"]),
        ]

