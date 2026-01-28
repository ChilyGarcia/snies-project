"use client";
import { RegisteredCoursesPanel } from "@/modules/courses/presentation/registered-courses.panel";
import { PermissionGuard } from "@/modules/auth/presentation/permission-guard";
export default function CoursesPage() {
    return (<PermissionGuard module="courses" action="view">
      <RegisteredCoursesPanel />
    </PermissionGuard>);
}
