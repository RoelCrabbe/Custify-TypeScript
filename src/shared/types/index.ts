import { ErrorHttpMethod, ErrorSeverity, ErrorStatus, ErrorType } from '@error-log/enums';
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

export type ErrorLogInput = {
    id?: number;
    type: ErrorType;
    severity: ErrorSeverity;
    httpMethod: ErrorHttpMethod;
    errorMessage: string;
    stackTrace: string;
    requestPath: string;
    status: ErrorStatus;
    isArchived?: boolean;
    archivedBy?: number;
    archivedDate?: Date;
};
