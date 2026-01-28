import type { WellbeingHumanResource } from "@/modules/wellbeing/types/human-resource";
import type { CreateWellbeingHumanResourceInput } from "../types/create-human-resource-input";

export interface WellbeingHumanResourceRepository {
  create(input: CreateWellbeingHumanResourceInput): Promise<WellbeingHumanResource>;
  list(params?: { year?: string; semester?: number }): Promise<WellbeingHumanResource[]>;
}

