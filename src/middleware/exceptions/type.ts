export const ErrorType = {
    NotFoundError: 'Not Found',
    ValidationError: 'Validation Error',
    AuthenticationError: 'Authentication Error',
} as const;

export type ErrorType = (typeof ErrorType)[keyof typeof ErrorType];

export const isValidType = (type: unknown): type is ErrorType => {
    return typeof type === 'string' && Object.values(ErrorType).includes(type as ErrorType);
};
