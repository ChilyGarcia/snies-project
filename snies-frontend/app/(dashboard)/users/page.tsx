"use client";
import RegisteredUsersPanel from "@/modules/users/presentation/registered-users.panel";
import { PermissionGuard } from "@/modules/auth/presentation/permission-guard";
export default function UsersPage() {
    return (<PermissionGuard requireRoot>
      <RegisteredUsersPanel />
    </PermissionGuard>);
}
