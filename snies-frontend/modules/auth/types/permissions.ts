export type PermissionAction = "view" | "create" | "edit" | "delete";
export type PermissionModule = "courses" | "wellbeing";
export type RoleInfo = {
    id: number;
    name: string;
};
export type MePermissionsResponse = {
    role: RoleInfo;
    permissions: Record<PermissionModule, Record<PermissionAction, boolean>>;
};
