export class CustifyError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode = 400, isOperational = true) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);

        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.isOperational = isOperational;

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
}

export const ErrorType = {
    NotFoundError: 'Not Found',
    ValidationError: 'Validation Error',
    AuthenticationError: 'Authentication Error',
} as const;

export type ErrorType = keyof typeof ErrorType;

export class NotFoundError extends CustifyError {
    constructor(message: string) {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}

export class AuthenticationError extends CustifyError {
    constructor(message: string) {
        super(message, 400);
        this.name = 'AuthenticationError';
    }
}

export class ValidationError extends CustifyError {
    constructor(message: string) {
        super(message, 400);
        this.name = 'ValidationError';
    }
}
