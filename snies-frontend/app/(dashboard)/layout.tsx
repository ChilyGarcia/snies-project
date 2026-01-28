"use client";
import type React from "react";
import { AuthGuard } from "@/modules/auth/presentation/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { FullscreenLoader } from "@/components/fullscreen-loader";
export default function DashboardGroupLayout({ children }: {
    children: React.ReactNode;
}) {
    return (<AuthGuard fallback={<FullscreenLoader title="Cargando sesión" subtitle="Validando autenticación…"/>}>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>);
}
