import { ErrorHttpMethod, ErrorSeverity, ErrorStatus, ErrorType } from '@errorLog';
import {
    NotificationCategory,
    NotificationPriority,
    NotificationStatus,
} from '@notification/enums';
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
    profileImage?: ProfileImageInput;
};

export type ProfileImageInput = {
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

export type UpdatePassWordInput = {
    id?: number;
    currentPassWord: string;
    newPassWord: string;
    confirmPassWord: string;
};

export type NotificationInput = {
    id?: number;
    title: string;
    body: string;
    status: NotificationStatus;
    category: NotificationCategory;
    priority: NotificationPriority;
    sentDate?: Date;
    readDate?: Date;
    sentById?: number;
    recipientById: number;
};
