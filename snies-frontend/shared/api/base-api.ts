export abstract class BaseApi {
    protected getToken(): string {
        const token = localStorage.getItem("access_token");
        if (!token)
            throw new Error("No hay token de autenticación");
        return token;
    }
}
