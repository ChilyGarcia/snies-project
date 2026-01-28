export type Role = {
    id: number;
    name: string;
    description: string;
};
export type RolePermissionRowApi = {
    module: "courses" | "wellbeing";
    can_view: boolean;
    can_create: boolean;
    can_edit: boolean;
    can_delete: boolean;
};
