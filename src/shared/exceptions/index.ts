export class CustifyError extends Error {
    public readonly statusCode: number;
    public readonly severity: SeverityType;

    constructor(message: string, statusCode = 400, severity: SeverityType = SeverityType.Handled) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);

        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.severity = severity;

        Error.captureStackTrace(this, this.constructor);
    }

    getStatusCode(): number {
        return this.statusCode;
    }

    getStatusMessage(): string {
        return ErrorType[this.name as keyof typeof ErrorType] ?? 'Application Error';
    }

    getMessage(): string {
        return this.message;
    }

    getSeverity(): SeverityType {
        return this.severity;
    }
}

export const ErrorType = {
    NotFoundError: 'Not Found',
    ValidationError: 'Validation Error',
    AuthenticationError: 'Authentication Error',
} as const;

export type ErrorType = (typeof ErrorType)[keyof typeof ErrorType];

export const SeverityType = {
    Handled: 'Handled',
    Unhandled: 'Unhandled',
    InputError: 'InputError',
    SystemError: 'SystemError',
    SecurityError: 'SecurityError',
} as const;

export type SeverityType = (typeof SeverityType)[keyof typeof SeverityType];

export class NotFoundError extends CustifyError {
    constructor(message: string) {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}

export class AuthenticationError extends CustifyError {
    constructor(message: string) {
        super(message, 401, SeverityType.SecurityError);
        this.name = 'AuthenticationError';
    }
}

export class ValidationError extends CustifyError {
    constructor(message: string) {
        super(message, 400, SeverityType.InputError);
        this.name = 'ValidationError';
    }
}
