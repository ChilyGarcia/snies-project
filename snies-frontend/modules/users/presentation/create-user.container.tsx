"use client";
import { UserForm } from "./components/user-form";
import { CreateUserUseCase } from "../hooks/use-cases/create-user.usecase";
import { UserApi } from "../api/user.api";
export function CreateUserContainer({ open, onClose, }: {
    open: boolean;
    onClose: () => void;
}) {
    const useCase = new CreateUserUseCase(new UserApi());
    async function handleSubmit(data: any) {
        await useCase.execute(data);
    }
    return <UserForm open={open} onClose={onClose} onSubmit={handleSubmit}/>;
}
