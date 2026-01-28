import { WellbeingActivity } from "@/modules/wellbeing/types/activity";
export function groupActivitiesBySemester(activities: WellbeingActivity[]) {
    const map: Record<string, number> = {};
    activities.forEach((activity) => {
        const key = `Semestre ${activity.semester}`;
        map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).map(([name, total]) => ({
        name,
        total,
    }));
}
export function groupActivitiesByType(activities: WellbeingActivity[]) {
    const map: Record<string, number> = {};
    activities.forEach((activity) => {
        const key = `Tipo ${activity.wellbeing_activity_type_id}`;
        map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).map(([name, total]) => ({
        name,
        total,
    }));
}
