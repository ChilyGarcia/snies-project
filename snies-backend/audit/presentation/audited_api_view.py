from __future__ import annotations

import json
from typing import Any

from rest_framework.views import APIView

from audit.application.use_cases.create_audit_log import CreateAuditLogUseCase
from audit.domain.entities.audit_log import AuditLog
from audit.infraestructure.persistence.django.audit_repository import DjangoAuditRepository
from notifications.application.use_cases.create_notification import CreateNotificationUseCase
from notifications.domain.entities.notification import Notification
from notifications.infraestructure.persistence.django.notification_repository import (
    DjangoNotificationRepository,
)


SENSITIVE_KEYS = {"password", "access", "refresh", "token"}


def _sanitize(obj: Any) -> Any:
    if isinstance(obj, dict):
        out = {}
        for k, v in obj.items():
            if str(k).lower() in SENSITIVE_KEYS:
                out[k] = "***"
            else:
                out[k] = _sanitize(v)
        return out
    if isinstance(obj, list):
        return [_sanitize(x) for x in obj]
    return obj


def _jsonable(obj: Any) -> Any:
    # Ensure values are JSON-serializable (Decimal/date/etc.)
    try:
        json.dumps(obj)
        return obj
    except Exception:
        return json.loads(json.dumps(obj, default=str))


class AuditedAPIView(APIView):
    """
    Logs all mutating requests (POST/PUT/PATCH/DELETE) under /api/ after DRF auth
    is applied.
    Skips /api/auth/ to avoid storing tokens/passwords.
    """

    audit_enabled = True
    notifications_enabled = True

    def _build_self_notification(
        self, module_root: str | None, action: str, request_data: Any
    ):
        if not module_root:
            return None

        # Only "business" modules; skip meta/internal modules
        if module_root in ("auth", "audit", "notifications"):
            return None

        # Only notify for create/update/delete
        if action not in ("create", "update", "delete"):
            return None

        name = None
        if isinstance(request_data, dict):
            name = request_data.get("name") or request_data.get(
                "activity_description"
            )

        # Titles/messages tuned for UI usefulness
        if module_root == "courses":
            if action == "create":
                title = "Nuevo curso creado"
                suffix = f": {name}" if name else ""
                message = f"Has creado un nuevo curso{suffix}."
            elif action == "update":
                title = "Curso actualizado"
                suffix = f": {name}" if name else ""
                message = f"Has actualizado un curso{suffix}."
            else:
                title = "Curso eliminado"
                message = "Has eliminado un curso."
        elif module_root.startswith("wellbeing"):
            if module_root == "wellbeing_activities":
                subject = "actividad de bienestar"
            elif module_root == "wellbeing_beneficiaries":
                subject = "beneficiarios de bienestar"
            else:
                subject = "recursos humanos de bienestar"

            if action == "create":
                title = "Registro creado"
                message = f"Has creado un registro de {subject}."
            elif action == "update":
                title = "Registro actualizado"
                message = f"Has actualizado un registro de {subject}."
            else:
                title = "Registro eliminado"
                message = f"Has eliminado un registro de {subject}."
        elif module_root.startswith("continuing_education"):
            if module_root == "continuing_education":
                subject = "educación continua"
            elif module_root == "continuing_education_teachers":
                subject = "docentes de educación continua"
            else:
                subject = "beneficiarios de educación continua"

            if action == "create":
                title = "Registro creado"
                message = f"Has creado un registro de {subject}."
            elif action == "update":
                title = "Registro actualizado"
                message = f"Has actualizado un registro de {subject}."
            else:
                title = "Registro eliminado"
                message = f"Has eliminado un registro de {subject}."
        else:
            if action == "create":
                title = "Registro creado"
                message = "Has creado un nuevo registro."
            elif action == "update":
                title = "Registro actualizado"
                message = "Has actualizado un registro."
            else:
                title = "Registro eliminado"
                message = "Has eliminado un registro."

        return {"title": title, "message": message, "level": "success"}

    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(request, response, *args, **kwargs)

        try:
            if not getattr(self, "audit_enabled", True):
                return response

            path = getattr(request, "path", "") or ""
            method = getattr(request, "method", "") or ""

            if not path.startswith("/api/"):
                return response
            if path.startswith("/api/auth/"):
                return response
            if path.startswith("/api/notifications/"):
                return response
            if path.startswith("/api/audit/"):
                return response
            if method not in ("POST", "PUT", "PATCH", "DELETE"):
                return response

            action = {
                "POST": "create",
                "PUT": "update",
                "PATCH": "update",
                "DELETE": "delete",
            }.get(method, "unknown")

            # module inference from path
            # /api/<module_root>/...
            parts = [p for p in path.split("/") if p]
            module_root = parts[1] if len(parts) > 1 else None
            module_map = {
                "wellbeing_activities": "wellbeing",
                "wellbeing_beneficiaries": "wellbeing",
                "wellbeing_human_resources": "wellbeing",
                "continuing_education": "continuing_education",
                "continuing_education_teachers": "continuing_education",
                "continuing_education_beneficiaries": "continuing_education",
            }
            module = module_map.get(module_root or "", module_root)

            # best-effort resource_id extraction
            resource_id = None
            for key in ("id", "user_id", "role_id"):
                if key in kwargs:
                    resource_id = str(kwargs[key])
                    break
            if resource_id is None:
                rid = getattr(
                    getattr(response, "data", None),
                    "get",
                    lambda _k, _d=None: None,
                )("id", None)
                if rid is not None:
                    resource_id = str(rid)

            user = getattr(request, "user", None)
            is_auth = bool(getattr(user, "is_authenticated", False))
            user_id = getattr(user, "id", None) if is_auth else None
            user_email = getattr(user, "email", None) if is_auth else None
            role = getattr(user, "role", None) if is_auth else None
            user_role = getattr(role, "name", None) if role else None

            # request/response payloads (sanitized)
            request_data = None
            try:
                request_data = _jsonable(_sanitize(getattr(request, "data", None)))
            except Exception:
                request_data = None

            response_data = None
            try:
                response_data = _jsonable(_sanitize(getattr(response, "data", None)))
            except Exception:
                response_data = None

            ip = request.META.get("REMOTE_ADDR")
            ua = request.META.get("HTTP_USER_AGENT")
            view_name = f"{self.__class__.__module__}.{self.__class__.__name__}"

            use_case = CreateAuditLogUseCase(audit_repository=DjangoAuditRepository())
            use_case.execute(
                AuditLog(
                    id=None,
                    created_at=None,
                    action=action,
                    method=method,
                    path=path,
                    status_code=int(getattr(response, "status_code", 0) or 0),
                    user_id=user_id,
                    user_email=user_email,
                    user_role=user_role,
                    ip=ip,
                    user_agent=ua,
                    view_name=view_name,
                    module=module,
                    resource_id=resource_id,
                    request_data=(
                        request_data if isinstance(request_data, dict) else None
                    ),
                    response_data=(
                        response_data if isinstance(response_data, dict) else None
                    ),
                )
            )

            # Self-notification (only on success)
            if (
                getattr(self, "notifications_enabled", True)
                and getattr(user, "is_authenticated", False)
                and 200 <= int(getattr(response, "status_code", 0) or 0) < 400
                and user_id is not None
            ):
                notif_payload = self._build_self_notification(
                    module_root, action, request_data
                )
                if notif_payload:
                    CreateNotificationUseCase(
                        notification_repository=DjangoNotificationRepository()
                    ).execute(
                        Notification(
                            id=None,
                            user_id=int(user_id),
                            created_at=None,
                            read_at=None,
                            is_read=False,
                            title=notif_payload["title"],
                            message=notif_payload["message"],
                            module=module,
                            action=action,
                            resource_id=resource_id,
                            level=notif_payload.get("level"),
                        )
                    )
        except Exception:
            # Never break the API because of audit logging
            pass

        return response
