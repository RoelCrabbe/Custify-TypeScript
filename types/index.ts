export enum Role {
    ADMIN = 'ADMIN',
    HR = 'HR',
    USER = 'USER',
}

export type AuthenticationResponse = {
    token?: string;
};

export type JwtToken = {
    userId: number;
    role: Role;
};
