"use client";
import { RegisteredWellbeingActivitiesPanel } from "@/modules/wellbeing/presentation/panel";
import { PermissionGuard } from "@/modules/auth/presentation/permission-guard";
export default function WellbeingPage() {
    return (<PermissionGuard module="wellbeing" action="view">
      <RegisteredWellbeingActivitiesPanel />
    </PermissionGuard>);
}
