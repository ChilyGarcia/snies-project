"use client";

import { PermissionGuard } from "@/modules/auth/presentation/permission-guard";
import { RegisteredAuditLogsPanel } from "@/modules/audit/presentation/registered-audit-logs.panel";

export default function AuditPage() {
  return (
    <PermissionGuard module="audit" action="view">
      <RegisteredAuditLogsPanel />
    </PermissionGuard>
  );
}

