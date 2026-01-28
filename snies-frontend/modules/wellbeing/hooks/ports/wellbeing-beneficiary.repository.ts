import { CreateWellbeingBeneficiaryInput } from "../types/create-beneficiary-input";
import { WellbeingBenefeciary } from "../../types/beneficiary";
export interface WellbeingBenefeciaryRepository {
    create(input: CreateWellbeingBeneficiaryInput): Promise<WellbeingBenefeciary>;
    list(): Promise<WellbeingBenefeciary[]>;
    update(id: string, input: Partial<CreateWellbeingBeneficiaryInput>): Promise<WellbeingBenefeciary>;
    delete(id: string): Promise<void>;
}
