import { useEffect, useState } from "react";
import { WellbeingBenefeciaryRepository } from "../ports/wellbeing-beneficiary.repository";
import { WellbeingBenefeciary } from "../../types/beneficiary";
import { CreateWellbeingBeneficiaryInput } from "../types/create-beneficiary-input";
export function useWellbeingBeneficiariesCRUD(repository: WellbeingBenefeciaryRepository) {
    const [beneficiaries, setBeneficiaries] = useState<WellbeingBenefeciary[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fetchBeneficiaries = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await repository.list();
            setBeneficiaries(data);
        }
        catch (err) {
            setError((err as Error).message);
        }
        finally {
            setLoading(false);
        }
    };
    const createBeneficiary = async (input: CreateWellbeingBeneficiaryInput) => {
        try {
            setLoading(true);
            const newB = await repository.create(input);
            setBeneficiaries(prev => [...prev, newB]);
            return { success: true, newB };
        }
        catch (err) {
            return { success: false, error: (err as Error).message };
        }
        finally {
            setLoading(false);
        }
    };
    const updateBeneficiary = async (id: string, input: Partial<CreateWellbeingBeneficiaryInput>) => {
        try {
            setLoading(true);
            const updated = await repository.update(id, input);
            setBeneficiaries(prev => prev.map(b => b.id === id ? updated : b));
            return { success: true, updated };
        }
        catch (err) {
            return { success: false, error: (err as Error).message };
        }
        finally {
            setLoading(false);
        }
    };
    const deleteBeneficiary = async (id: string) => {
        try {
            setLoading(true);
            await repository.delete(id);
            setBeneficiaries(prev => prev.filter(b => b.id !== id));
            return { success: true };
        }
        catch (err) {
            return { success: false, error: (err as Error).message };
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchBeneficiaries();
    }, []);
    return {
        beneficiaries,
        loading,
        error,
        fetchBeneficiaries,
        createBeneficiary,
        updateBeneficiary,
        deleteBeneficiary
    };
}
