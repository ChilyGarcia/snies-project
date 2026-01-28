from __future__ import annotations

from abc import ABC, abstractmethod

from audit.domain.entities.audit_log import AuditLog


class AuditRepository(ABC):
    @abstractmethod
    def create(self, log: AuditLog) -> AuditLog:
        raise NotImplementedError

