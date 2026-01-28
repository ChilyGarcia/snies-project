"use client";
import type React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { PermissionAction, PermissionModule } from "@/modules/auth/types/permissions";
import { usePermissions } from "@/modules/auth/presentation/permissions-provider";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
type PermissionGuardProps = {
    children: React.ReactNode;
    module?: PermissionModule;
    action?: PermissionAction;
    requireRoot?: boolean;
};
export function PermissionGuard({ children, module, action = "view", requireRoot = false, }: PermissionGuardProps) {
    const router = useRouter();
    const { loading, error, hasRole, can } = usePermissions();
    const allowed = requireRoot ? hasRole("root") : module ? can(module, action) : true;
    useEffect(() => {
        if (!loading && !allowed) {
            toast.error("Acceso restringido", {
                description: "No tienes permisos para acceder a esta sección.",
            });
        }
    }, [allowed, loading]);
    if (loading)
        return <div className="min-h-screen bg-muted/20"/>;
    if (error) {
        return (<EmptyState title="No se pudieron cargar permisos" description={error}/>);
    }
    if (!allowed) {
        return (<div className="p-6">
        <EmptyState title="Acceso restringido" description="No tienes permisos para ver esta sección."/>
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => router.replace("/dashboard")}>
            Volver al dashboard
          </Button>
        </div>
      </div>);
    }
    return <>{children}</>;
}
