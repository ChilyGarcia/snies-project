function normalizeBaseUrl(url: string) {
    return url.trim().replace(/\/+$/, "");
}
export const API_URL = process.env.NEXT_PUBLIC_API_URL
    ? normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL)
    : "";
export function requireApiUrl() {
    if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL no está configurada. Crea un .env.local con NEXT_PUBLIC_API_URL=http://localhost:8000 (o la URL real de tu backend) y reinicia `pnpm dev`.");
    }
    return API_URL;
}
