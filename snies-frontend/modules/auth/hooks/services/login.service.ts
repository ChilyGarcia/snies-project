import { AuthPort } from "../ports/auth.port";
import { saveToken, saveRefreshToken } from "@/shared/utils/storage";
export class LoginService {
    constructor(private authPort: AuthPort) { }
    async execute(email: string, password: string) {
        if (!email || !password)
            throw new Error("Credenciales inválidas");
        const response = await this.authPort.login({ email, password });
        saveToken(response.access);
        if (response.refresh)
            saveRefreshToken(response.refresh);
        return response;
    }
}
