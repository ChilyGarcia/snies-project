export interface AuthPort {
    login(credentials: {
        email: string;
        password: string;
    }): Promise<{
        access: string;
        refresh?: string;
    }>;
}
