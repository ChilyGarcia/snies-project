import { useEffect, useState } from "react";
import { WellbeingActivity } from "@/modules/wellbeing/types/activity";
import { WellbeingActivityRepository } from "../ports/wellbeing-activity.repository";
export function useWellbeingActivities(repository: WellbeingActivityRepository) {
    const [activities, setActivities] = useState<WellbeingActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const fetchActivities = async () => {
        try {
            setLoading(true);
            const data = await repository.list();
            setActivities(data);
        }
        catch (err) {
            setError((err as Error).message);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchActivities();
    }, []);
    return {
        activities,
        loading,
        error,
        refetch: fetchActivities,
    };
}
