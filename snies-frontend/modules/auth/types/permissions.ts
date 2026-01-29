export type PermissionAction = "view" | "create" | "edit" | "delete";
export type PermissionModule =
  | "courses"
  | "wellbeing"
  | "continuing_education"
  | "audit"
  | "software_activities";
export type RoleInfo = {
    id: number;
    name: string;
};
export type MePermissionsResponse = {
    role: RoleInfo;
    // El backend puede crecer con nuevos módulos; mantenemos esto flexible.
    permissions: Record<string, Record<PermissionAction, boolean>>;
};
