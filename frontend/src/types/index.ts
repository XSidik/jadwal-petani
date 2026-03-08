export interface Task {
    id: number;
    taskName: string;
    description: string;
    scheduledDate: string;
    isCompleted: boolean;
    eventId?: string;
}

export interface Schedule {
    scheduleId: number;
    plantName: string;
    plantingDate: string;
    tasks: Task[];
}
