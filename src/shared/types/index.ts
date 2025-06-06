import { Role } from '@types';
export * from './role';

export type AuthenticationResponse = {
    token?: string;
};

export type JwtToken = {
    userId: number;
    role: Role;
};

export type UserInput = {
    id?: number;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    passWord: string;
    role: Role;
    isActive: boolean;
    phoneNumber?: string;
};
