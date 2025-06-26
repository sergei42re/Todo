export interface Habit {
    id: string;
    title: string;
    completedDays: Record<string, boolean>;
}