import { CreateUserInput } from "../types/create-user-input";
import { UserRepository } from "../ports/user.repository";
import { User } from "../../types/user";
export class CreateUserUseCase {
    constructor(private readonly repository: UserRepository) { }
    async execute(input: CreateUserInput): Promise<User> {
        return this.repository.create(input);
    }
}
