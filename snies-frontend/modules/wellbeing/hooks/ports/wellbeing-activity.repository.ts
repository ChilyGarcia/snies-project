import { WellbeingActivity } from "../../types/activity";
import { CreateWellbeingActivityInput } from "../types/create-activity-input";
export interface WellbeingActivityRepository {
    create(input: CreateWellbeingActivityInput): Promise<WellbeingActivity>;
    list(): Promise<WellbeingActivity[]>;
}
