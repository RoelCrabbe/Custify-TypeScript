export const UserRole = {
    Admin: 'Admin',
    HumanResources: 'Human Resources',
    Guest: 'Guest',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const isValidUserRole = (role: unknown): role is UserRole => {
    return typeof role === 'string' && Object.values(UserRole).includes(role as UserRole);
};

export const isActiveUserStatus = (status: UserStatus): boolean => {
    return status === UserStatus.Active;
};

export const UserStatus = {
    Active: 'Active',
    InActive: 'Inactive',
    Deleted: 'Deleted',
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const isValidUserStatus = (status: unknown): status is UserStatus => {
    return typeof status === 'string' && Object.values(UserStatus).includes(status as UserStatus);
};
