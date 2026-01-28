"use client";
import { WellbeingActivityForm } from "./components/wellbeing-activity-form";
import { CreateWellbeingActivityUseCase } from "../hooks/use-cases/create-wellbeing-activity.usecase";
import { WellbeingActivityApi } from "../api/wellbeing-activity.api";
export function CreateWellbeingActivityContainer({ open, onClose, }: {
    open: boolean;
    onClose: () => void;
}) {
    const useCase = new CreateWellbeingActivityUseCase(new WellbeingActivityApi());
    async function handleSubmit(data: any) {
        await useCase.execute(data);
    }
    return <WellbeingActivityForm open={open} onClose={onClose} onSubmit={handleSubmit}/>;
}
