import { UserRepository } from "../hooks/ports/user.repository";
import { CreateUserInput } from "../hooks/types/create-user-input";
import { User } from "../types/user";
import { requireApiUrl } from "@/shared/config/api";
export class UserApi implements UserRepository {
    async create(input: CreateUserInput): Promise<User> {
        const token = localStorage.getItem("access_token");
        if (!token)
            throw new Error("No hay token de autenticación");
        const res = await fetch(`${requireApiUrl()}/api/auth/register/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(input),
        });
        if (!res.ok) {
            let msg = "Error creando curso";
            try {
                const err = await res.json();
                msg = err.message || msg;
            }
            catch { }
            throw new Error(msg);
        }
        return await res.json();
    }
}
