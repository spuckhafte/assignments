export type User = {
    username: string,
    filters: string[],

    tasks: Task[],
}

export type Task = {
    body: string,
    uid: string,

    createdAt: number,
    dueDate: number,

    filter: string,
    important: boolean,
    complete: boolean,
}
