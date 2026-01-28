import { clearTokens } from "@/shared/utils/storage";
export class LogoutService {
    async execute() {
        clearTokens();
    }
}
