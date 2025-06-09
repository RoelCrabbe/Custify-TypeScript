import { User } from '@user/model';

export const UserRole = {
    Admin: 'Admin',
    HumanResources: 'Human Resources',
    Guest: 'Guest',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const isValidUserRole = (role: unknown): role is UserRole => {
    return typeof role === 'string' && Object.values(UserRole).includes(role as UserRole);
};

export const getUserRole = (user: User): UserRole => {
    const role = user.getRole();
    return role && isValidUserRole(role) ? role : UserRole.Guest;
};

export const isUserRole = (user: User, role: UserRole): boolean => {
    return getUserRole(user) === role;
};

export const isAdmin = (user: User): boolean => {
    return isUserRole(user, UserRole.Admin);
};

export const isHumanResources = (user: User): boolean => {
    return isUserRole(user, UserRole.HumanResources);
};

export const isGuest = (user: User): boolean => {
    return isUserRole(user, UserRole.Guest);
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

export const isActiveUserStatus = (status: UserStatus): boolean => {
    return status === UserStatus.Active;
};

export const isInactiveUserStatus = (status: UserStatus): boolean => {
    return status === UserStatus.InActive;
};

export const isDeletedUserStatus = (status: UserStatus): boolean => {
    return status === UserStatus.Deleted;
};

export const isUserAccessible = (status: UserStatus): boolean => {
    return status !== UserStatus.Deleted;
};
