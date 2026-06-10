export interface Task {
    id: number,
    title: string,
    isCompleted: boolean,
    description?: string
}

export type CommandEvent = {
    command: string;
    args: string[];
}