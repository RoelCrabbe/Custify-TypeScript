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
