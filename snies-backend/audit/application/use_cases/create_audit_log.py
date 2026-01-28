from audit.domain.entities.audit_log import AuditLog
from audit.domain.ports.audit_repository import AuditRepository


class CreateAuditLogUseCase:
    def __init__(self, audit_repository: AuditRepository):
        self.audit_repository = audit_repository

    def execute(self, log: AuditLog) -> AuditLog:
        return self.audit_repository.create(log)

