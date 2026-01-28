"use client";
import { useEffect, useState } from "react";
import { WellbeingActivity } from "@/modules/wellbeing/types/activity";
import { WellbeingActivityApi } from "@/modules/wellbeing/api/wellbeing-activity.api";
export function useActivitiesDashboard() {
    const [activities, setActivities] = useState<WellbeingActivity[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const api = new WellbeingActivityApi();
        api.list()
            .then(setActivities)
            .finally(() => setLoading(false));
    }, []);
    return { activities, loading };
}
