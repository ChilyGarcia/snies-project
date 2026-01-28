import { AuthPort } from "../hooks/ports/auth.port";
import { requireApiUrl } from "@/shared/config/api";
export class AuthApi implements AuthPort {
    async login(credentials: {
        email: string;
        password: string;
    }) {
        const response = await fetch(`${requireApiUrl()}/api/auth/login/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });
        const data = await response.json();
        if (!response.ok)
            throw new Error(data.detail || "Error de autenticación");
        if (!data.access)
            throw new Error("No se recibió el token");
        return {
            access: data.access,
            refresh: data.refresh,
        };
    }
}
