export const Role = {
    Admin: 'Admin',
    HumanResources: 'HumanResources',
    Guest: 'Guest',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const isValidRole = (role: unknown): role is Role => {
    return typeof role === 'string' && role in Role;
};
