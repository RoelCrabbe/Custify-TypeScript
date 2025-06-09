import { UserRole, UserStatus } from '@user/enums';

export type AuthenticationResponse = {
    token?: string;
};

export type JwtToken = {
    userId: number;
    role: UserRole;
};

export type UserInput = {
    id?: number;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    passWord: string;
    role: UserRole;
    status: UserStatus;
    phoneNumber?: string;
};
