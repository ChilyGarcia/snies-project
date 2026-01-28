import { requireApiUrl } from "@/shared/config/api";
import { getToken } from "@/shared/utils/storage";
import type { MePermissionsResponse } from "@/modules/auth/types/permissions";
export async function fetchMePermissions(): Promise<MePermissionsResponse> {
    const token = getToken();
    if (!token)
        throw new Error("No hay token de autenticación");
    const res = await fetch(`${requireApiUrl()}/api/users/me/permissions/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (res.status === 401)
        throw new Error("No autenticado");
    if (res.status === 403)
        throw new Error("No autorizado");
    if (!res.ok)
        throw new Error("No se pudieron obtener permisos");
    return await res.json();
}
