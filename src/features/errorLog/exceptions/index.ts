import { ErrorSeverity, ErrorType } from '@errorLog';

export class CustifyError extends Error {
    public readonly statusCode: number;
    public readonly severity: ErrorSeverity;

    constructor(
        message: string,
        statusCode = 400,
        severity: ErrorSeverity = ErrorSeverity.Handled,
    ) {
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

    getType(): ErrorType {
        return ErrorType[this.name as keyof typeof ErrorType] ?? 'Application Error';
    }

    getMessage(): string {
        return this.message;
    }

    getSeverity(): ErrorSeverity {
        return this.severity;
    }
}

export class NotFoundError extends CustifyError {
    constructor(message: string) {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}

export class AuthenticationError extends CustifyError {
    constructor(message: string) {
        super(message, 401, ErrorSeverity.SecurityError);
        this.name = 'AuthenticationError';
    }
}

export class ValidationError extends CustifyError {
    constructor(message: string) {
        super(message, 400, ErrorSeverity.InputError);
        this.name = 'ValidationError';
    }
}
