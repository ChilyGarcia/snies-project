"use client";

import { PermissionGuard } from "@/modules/auth/presentation/permission-guard";
import { RegisteredSoftwareActivitiesPanel } from "@/modules/software_activities/presentation/registered-software-activities.panel";

export default function SoftwareActivitiesPage() {
  return (
    <PermissionGuard module="software_activities" action="view">
      <RegisteredSoftwareActivitiesPanel />
    </PermissionGuard>
  );
}

