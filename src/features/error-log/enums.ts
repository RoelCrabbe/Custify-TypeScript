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

export const HttpMethod = {
    Get: 'Get',
    Post: 'Post',
    Put: 'Put',
    Patch: 'Patch',
    Delete: 'Delete',
} as const;

export type HttpMethod = (typeof HttpMethod)[keyof typeof HttpMethod];

export const isValidMethod = (method: unknown): method is HttpMethod => {
    return typeof method === 'string' && Object.values(HttpMethod).includes(method as HttpMethod);
};

export const ErrorStatus = {
    New: 'New',
    Reviewed: 'Reviewed ',
    Resolved: 'Resolved',
} as const;

export type ErrorStatus = (typeof ErrorStatus)[keyof typeof ErrorStatus];
