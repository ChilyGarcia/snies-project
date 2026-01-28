"use client";
import type React from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { MePermissionsResponse, PermissionAction, PermissionModule } from "@/modules/auth/types/permissions";
import { fetchMePermissions } from "@/modules/auth/api/me-permissions.api";
import { getToken } from "@/shared/utils/storage";
type PermissionsContextValue = {
    loading: boolean;
    error: string | null;
    data: MePermissionsResponse | null;
    refresh: () => Promise<void>;
    hasRole: (roleName: string) => boolean;
    can: (module: PermissionModule, action: PermissionAction) => boolean;
};
const PermissionsContext = createContext<PermissionsContextValue | null>(null);
export function PermissionsProvider({ children }: {
    children: React.ReactNode;
}) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<MePermissionsResponse | null>(null);
    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            if (!getToken()) {
                setData(null);
                setError(null);
                return;
            }
            const res = await fetchMePermissions();
            setData(res);
        }
        catch (e) {
            setData(null);
            setError(e instanceof Error ? e.message : "Error cargando permisos");
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        refresh();
    }, [refresh]);
    useEffect(() => {
        const handler = () => {
            refresh();
        };
        window.addEventListener("auth-token-changed", handler);
        return () => window.removeEventListener("auth-token-changed", handler);
    }, [refresh]);
    const value = useMemo<PermissionsContextValue>(() => {
        const roleName = data?.role?.name;
        return {
            loading,
            error,
            data,
            refresh,
            hasRole: (r: string) => roleName === r,
            can: (module, action) => {
                if (roleName === "root")
                    return true;
                return Boolean(data?.permissions?.[module]?.[action]);
            },
        };
    }, [data, error, loading, refresh]);
    return <PermissionsContext.Provider value={value}>{children}</PermissionsContext.Provider>;
}
export function usePermissions() {
    const ctx = useContext(PermissionsContext);
    if (!ctx)
        throw new Error("usePermissions debe usarse dentro de PermissionsProvider");
    return ctx;
}
