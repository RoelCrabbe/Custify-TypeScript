export const Status = {
    Active: 'Active',
    InActive: 'Inactive',
    Deleted: 'Deleted',
} as const;

export type Status = (typeof Status)[keyof typeof Status];

export const isValidStatus = (status: unknown): status is Status => {
    return typeof status === 'string' && Object.values(Status).includes(status as Status);
};

export const isActiveStatus = (status: Status): boolean => {
    return status === Status.Active;
};

export const isInactiveStatus = (status: Status): boolean => {
    return status === Status.InActive;
};

export const isDeletedStatus = (status: Status): boolean => {
    return status === Status.Deleted;
};

export const isUserAccessible = (status: Status): boolean => {
    return status !== Status.Deleted;
};
