"use client";
import { DashboardActivitiesSection } from "@/modules/dashboard/presentation/DashboardActivitiesSection";
import { PermissionGuard } from "@/modules/auth/presentation/permission-guard";
export default function DashboardPage() {
    return (<>
      <PermissionGuard requireRoot>
        <DashboardActivitiesSection />
      </PermissionGuard>
    </>);
}
