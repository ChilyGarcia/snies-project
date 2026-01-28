"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { requireApiUrl } from "@/shared/config/api";
import { clearTokens, getToken } from "@/shared/utils/storage";
type AuthGuardProps = {
    children: React.ReactNode;
    redirectTo?: string;
    verifyWithMeEndpoint?: boolean;
    fallback?: React.ReactNode;
};
export function AuthGuard({ children, redirectTo = "/login", verifyWithMeEndpoint = true, fallback = null, }: AuthGuardProps) {
    const router = useRouter();
    const [allowed, setAllowed] = useState(false);
    const [checking, setChecking] = useState(true);
    useEffect(() => {
        let cancelled = false;
        async function run() {
            try {
                setChecking(true);
                setAllowed(false);
                const token = getToken();
                if (!token) {
                    clearTokens();
                    if (!cancelled)
                        router.replace(redirectTo);
                    return;
                }
                if (!verifyWithMeEndpoint) {
                    if (!cancelled)
                        setAllowed(true);
                    return;
                }
                const base = requireApiUrl();
                const res = await fetch(`${base}/api/users/me/`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (res.status === 401) {
                    clearTokens();
                    if (!cancelled)
                        router.replace(redirectTo);
                    return;
                }
                if (!res.ok) {
                    clearTokens();
                    if (!cancelled)
                        router.replace(redirectTo);
                    return;
                }
                if (!cancelled)
                    setAllowed(true);
            }
            catch {
                clearTokens();
                if (!cancelled)
                    router.replace(redirectTo);
            }
            finally {
                if (!cancelled)
                    setChecking(false);
            }
        }
        run();
        return () => {
            cancelled = true;
        };
    }, [redirectTo, router, verifyWithMeEndpoint]);
    if (checking)
        return <>{fallback}</>;
    if (!allowed)
        return null;
    return <>{children}</>;
}
