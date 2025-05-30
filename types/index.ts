export enum Role {
    ADMIN = 'ADMIN',
    HR = 'HR',
    USER = 'USER',
}

type IdName = {
    id?: number;
    name: string;
};

export type AuthenticationResponse = {
    userId?: number;
    token?: string;
    userName?: string;
    fullName?: string;
    role?: Role;
};

export type JwtToken = {
    userId: number;
    role: Role;
};
