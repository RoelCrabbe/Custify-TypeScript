import { User } from '@user/model';

export const Role = {
    Admin: 'Admin',
    HumanResources: 'Human Resources',
    Guest: 'Guest',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const isValidRole = (role: unknown): role is Role => {
    return typeof role === 'string' && Object.values(Role).includes(role as Role);
};

export const getUserRole = (user: User): Role => {
    const role = user.getRole();
    return role && isValidRole(role) ? role : Role.Guest;
};

export const isUserRole = (user: User, role: Role): boolean => {
    return getUserRole(user) === role;
};

export const isAdmin = (user: User): boolean => {
    return isUserRole(user, Role.Admin);
};

export const isHumanResources = (user: User): boolean => {
    return isUserRole(user, Role.HumanResources);
};

export const isGuest = (user: User): boolean => {
    return isUserRole(user, Role.Guest);
};

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
