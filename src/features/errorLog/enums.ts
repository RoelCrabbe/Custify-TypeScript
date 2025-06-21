export const ErrorType = {
    NotFoundError: 'Not Found',
    ValidationError: 'Validation Error',
    AuthenticationError: 'Authentication Error',
} as const;

export type ErrorType = (typeof ErrorType)[keyof typeof ErrorType];

export const isValidType = (type: unknown): type is ErrorType => {
    return typeof type === 'string' && Object.values(ErrorType).includes(type as ErrorType);
};

export const ErrorSeverity = {
    Handled: 'Handled',
    Unhandled: 'Unhandled',
    InputError: 'Input Error',
    SystemError: 'System Error',
    SecurityError: 'Security Error',
} as const;

export type ErrorSeverity = (typeof ErrorSeverity)[keyof typeof ErrorSeverity];

export const isValidSeverity = (severity: unknown): severity is ErrorSeverity => {
    return (
        typeof severity === 'string' &&
        Object.values(ErrorSeverity).includes(severity as ErrorSeverity)
    );
};

export const ErrorHttpMethod = {
    Get: 'Get',
    Post: 'Post',
    Put: 'Put',
    Patch: 'Patch',
    Delete: 'Delete',
} as const;

export type ErrorHttpMethod = (typeof ErrorHttpMethod)[keyof typeof ErrorHttpMethod];

export const isValidErrorHttpMethod = (method: unknown): method is ErrorHttpMethod => {
    return (
        typeof method === 'string' &&
        Object.values(ErrorHttpMethod).includes(method as ErrorHttpMethod)
    );
};

export const ErrorStatus = {
    New: 'New',
    Reviewed: 'Reviewed ',
    Resolved: 'Resolved',
} as const;

export type ErrorStatus = (typeof ErrorStatus)[keyof typeof ErrorStatus];

export const isValidStatus = (status: unknown): status is ErrorStatus => {
    return typeof status === 'string' && Object.values(ErrorStatus).includes(status as ErrorStatus);
};
