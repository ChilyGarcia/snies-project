const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
export function saveToken(token: string) {
    if (typeof window === "undefined")
        return;
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    window.dispatchEvent(new Event("auth-token-changed"));
}
export function saveRefreshToken(token: string) {
    if (typeof window === "undefined")
        return;
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
    window.dispatchEvent(new Event("auth-token-changed"));
}
export function getToken() {
    if (typeof window === "undefined")
        return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}
export function getRefreshToken() {
    if (typeof window === "undefined")
        return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
}
export function clearTokens() {
    if (typeof window === "undefined")
        return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.dispatchEvent(new Event("auth-token-changed"));
}
