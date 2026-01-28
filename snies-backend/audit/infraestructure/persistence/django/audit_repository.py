from audit.domain.entities.audit_log import AuditLog
from audit.domain.ports.audit_repository import AuditRepository
from audit.infraestructure.persistence.django.models import AuditLogModel


class DjangoAuditRepository(AuditRepository):
    def create(self, log: AuditLog) -> AuditLog:
        m = AuditLogModel.objects.create(
            action=log.action,
            method=log.method,
            path=log.path,
            status_code=log.status_code,
            user_id=log.user_id,
            user_email=log.user_email,
            user_role=log.user_role,
            ip=log.ip,
            user_agent=log.user_agent,
            view_name=log.view_name,
            module=log.module,
            resource_id=log.resource_id,
            request_data=log.request_data,
            response_data=log.response_data,
        )
        return AuditLog(
            id=m.id,
            created_at=m.created_at,
            action=m.action,
            method=m.method,
            path=m.path,
            status_code=m.status_code,
            user_id=m.user_id,
            user_email=m.user_email,
            user_role=m.user_role,
            ip=m.ip,
            user_agent=m.user_agent,
            view_name=m.view_name,
            module=m.module,
            resource_id=m.resource_id,
            request_data=m.request_data,
            response_data=m.response_data,
        )

