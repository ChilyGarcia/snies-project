import { CreateUserInput } from "../types/create-user-input";
import { User } from "../../types/user";
export interface UserRepository {
    create(input: CreateUserInput): Promise<User>;
}
