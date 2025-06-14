import { ErrorHttpMethod, ErrorSeverity, ErrorStatus, ErrorType } from '@error-log';
import { UserRole, UserStatus } from '@user';

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
    profileImage?: UserImageInput;
};

export type UserImageInput = {
    id?: number;
    url: string;
    altText: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
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
    resolvedById?: number;
    resolvedDate?: Date;
};
