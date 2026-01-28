import { WellbeingActivityRepository } from "../ports/wellbeing-activity.repository";
import { CreateWellbeingActivityInput } from "../types/create-activity-input";
export class CreateWellbeingActivityUseCase {
    constructor(private readonly repo: WellbeingActivityRepository) { }
    execute(input: CreateWellbeingActivityInput) {
        return this.repo.create(input);
    }
}
