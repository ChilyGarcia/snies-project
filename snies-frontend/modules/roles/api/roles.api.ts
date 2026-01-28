import { requireApiUrl } from "@/shared/config/api";
import { getToken } from "@/shared/utils/storage";
import type { Role, RolePermissionRowApi } from "@/modules/roles/types/role";
function authHeaders() {
    const token = getToken();
    if (!token)
        throw new Error("No hay token de autenticación");
    return {
        Authorization: `Bearer ${token}`,
    };
}
export async function listRoles(): Promise<Role[]> {
    const res = await fetch(`${requireApiUrl()}/api/roles/`, {
        headers: {
            ...authHeaders(),
        },
    });
    if (res.status === 401)
        throw new Error("No autenticado");
    if (res.status === 403)
        throw new Error("No autorizado");
    if (!res.ok)
        throw new Error("No se pudieron listar roles");
    return await res.json();
}
export async function createRole(input: {
    name: string;
    description: string;
}): Promise<Role> {
    const res = await fetch(`${requireApiUrl()}/api/roles/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
        },
        body: JSON.stringify(input),
    });
    if (res.status === 401)
        throw new Error("No autenticado");
    if (res.status === 403)
        throw new Error("No autorizado");
    if (!res.ok)
        throw new Error("No se pudo crear el rol");
    return await res.json();
}
export async function getRolePermissions(roleId: number): Promise<RolePermissionRowApi[]> {
    const res = await fetch(`${requireApiUrl()}/api/roles/${roleId}/permissions/`, {
        headers: {
            ...authHeaders(),
        },
    });
    if (res.status === 401)
        throw new Error("No autenticado");
    if (res.status === 403)
        throw new Error("No autorizado");
    if (!res.ok)
        throw new Error("No se pudieron obtener permisos del rol");
    return await res.json();
}
export async function updateRolePermissions(roleId: number, rows: RolePermissionRowApi[]): Promise<void> {
    const res = await fetch(`${requireApiUrl()}/api/roles/${roleId}/permissions/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
        },
        body: JSON.stringify(rows),
    });
    if (res.status === 401)
        throw new Error("No autenticado");
    if (res.status === 403)
        throw new Error("No autorizado");
    if (!res.ok)
        throw new Error("No se pudieron actualizar permisos del rol");
}
export async function assignRoleToUser(userId: number, roleId: number): Promise<void> {
    const res = await fetch(`${requireApiUrl()}/api/roles/assign/${userId}/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
        },
        body: JSON.stringify({ role_id: roleId }),
    });
    if (res.status === 401)
        throw new Error("No autenticado");
    if (res.status === 403)
        throw new Error("No autorizado");
    if (!res.ok)
        throw new Error("No se pudo asignar el rol");
}
export type PagedUsersResponse = {
    count: number;
    page: number;
    page_size: number;
    results: Array<{
        id: number;
        name: string;
        email: string;
        role: string;
    }>;
};
export async function listUsersPaged(page = 1, pageSize = 20): Promise<PagedUsersResponse> {
    const res = await fetch(`${requireApiUrl()}/api/users/?page=${page}&page_size=${pageSize}`, {
        headers: {
            ...authHeaders(),
        },
    });
    if (res.status === 401)
        throw new Error("No autenticado");
    if (res.status === 403)
        throw new Error("No autorizado");
    if (!res.ok)
        throw new Error("No se pudieron listar usuarios");
    return await res.json();
}
