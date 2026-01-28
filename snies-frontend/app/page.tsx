"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { requireApiUrl } from "@/shared/config/api";
import { clearTokens, getToken } from "@/shared/utils/storage";
import { SessionSplash } from "@/components/session-splash";
export default function Home() {
    const router = useRouter();
    useEffect(() => {
        let cancelled = false;
        async function check() {
            const token = getToken();
            if (!token) {
                clearTokens();
                if (!cancelled)
                    router.replace("/login");
                return;
            }
            try {
                const res = await fetch(`${requireApiUrl()}/api/users/me/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.status === 401) {
                    clearTokens();
                    if (!cancelled)
                        router.replace("/login");
                    return;
                }
                if (!res.ok) {
                    clearTokens();
                    if (!cancelled)
                        router.replace("/login");
                    return;
                }
                if (!cancelled)
                    router.replace("/dashboard");
            }
            catch {
                clearTokens();
                if (!cancelled)
                    router.replace("/login");
            }
        }
        check();
        return () => {
            cancelled = true;
        };
    }, [router]);
    return <SessionSplash />;
}
