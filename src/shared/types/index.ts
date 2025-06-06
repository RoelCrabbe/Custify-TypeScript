import { Role } from '@user/role';
import { Status } from '@user/status';

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
    status: Status;
    phoneNumber?: string;
};
