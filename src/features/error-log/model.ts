import { EntityBase } from '@base/entityBase';
import { ErrorSeverity, ErrorType, HttpMethod } from '@error-log/enums';
import { ValidationError } from '@error-log/exceptions';
import { PrismaErrorLog } from '@prisma/index';
import { User } from '@user/model';

export class ErrorLog extends EntityBase {
    public readonly type: ErrorType;
    public readonly severity: ErrorSeverity;
    public readonly httpMethod: HttpMethod;
    public readonly errorMessage: string;
    public readonly stackTrace: string;
    public readonly requestPath: string;

    constructor(log: {
        type: ErrorType;
        severity: ErrorSeverity;
        httpMethod: HttpMethod;
        errorMessage: string;
        stackTrace: string;
        requestPath: string;
        id?: number;
        createdDate?: Date;
        modifiedDate?: Date;
        createdById?: number;
        modifiedById?: number;
    }) {
        super(log);

        this.type = log.type;
        this.errorMessage = log.errorMessage;
        this.stackTrace = log.stackTrace;
        this.requestPath = log.requestPath;
        this.httpMethod = log.httpMethod;
        this.severity = log.severity;
        this.validate(log);
    }

    private validate(log: {
        type: ErrorType;
        severity: ErrorSeverity;
        httpMethod: HttpMethod;
        errorMessage: string;
        stackTrace: string;
        requestPath: string;
    }): void {
        if (!log.type?.trim()) {
            throw new ValidationError('ErrorLog validation: Type is required');
        }
        if (!log.severity?.trim()) {
            throw new ValidationError('ErrorLog validation: Severity is required');
        }
        if (!log.httpMethod?.trim()) {
            throw new ValidationError('ErrorLog validation: Http Method is required');
        }
        if (!log.errorMessage?.trim()) {
            throw new ValidationError('ErrorLog validation: Error message is required');
        }
        if (!log.stackTrace?.trim()) {
            throw new ValidationError('ErrorLog validation: Stack Trace is required');
        }
        if (!log.requestPath?.trim()) {
            throw new ValidationError('ErrorLog validation: Request Path is required');
        }
    }

    getType(): string {
        return this.type;
    }

    getSeverity(): ErrorSeverity {
        return this.severity;
    }

    getHttpMethod(): string {
        return this.httpMethod;
    }

    getErrorMessage(): string {
        return this.errorMessage;
    }

    getStackTrace(): string {
        return this.stackTrace;
    }

    getRequestPath(): string {
        return this.requestPath;
    }

    equals(log: ErrorLog): boolean {
        return (
            this.type === log.getType() &&
            this.severity === log.getSeverity() &&
            this.httpMethod === log.getHttpMethod() &&
            this.errorMessage === log.getErrorMessage() &&
            this.stackTrace === log.getStackTrace() &&
            this.requestPath === log.getRequestPath()
        );
    }

    toJSON() {
        return {
            id: this.getId(),
            type: this.type,
            severity: this.severity,
            httpMethod: this.httpMethod,
            errorMessage: this.errorMessage,
            stackTrace: this.stackTrace,
            requestPath: this.requestPath,
            createdDate: this.getCreatedDate(),
            modifiedDate: this.getModifiedDate(),
            createdById: this.getCreatedById(),
            modifiedById: this.getModifiedById(),
        };
    }

    static from({
        id,
        type,
        severity,
        httpMethod,
        errorMessage,
        stackTrace,
        requestPath,
        createdDate,
        modifiedDate,
        createdById,
        modifiedById,
    }: PrismaErrorLog): ErrorLog {
        return new ErrorLog({
            id,
            type: type as ErrorType,
            severity: severity as ErrorSeverity,
            httpMethod: httpMethod as HttpMethod,
            errorMessage,
            stackTrace,
            requestPath,
            createdDate: createdDate || undefined,
            modifiedDate: modifiedDate || undefined,
            createdById: createdById || undefined,
            modifiedById: modifiedById || undefined,
        });
    }

    static create({
        currentUser,
        errorData,
    }: {
        currentUser: User | null;
        errorData: {
            type: ErrorType;
            severity: ErrorSeverity;
            httpMethod: HttpMethod;
            errorMessage: string;
            stackTrace: string;
            requestPath: string;
        };
    }): ErrorLog {
        return new ErrorLog({
            ...errorData,
            createdById: currentUser?.getId() ?? undefined,
        });
    }

    static update({
        currentUser,
        existingLog,
        updateData,
    }: {
        currentUser: User;
        existingLog: ErrorLog;
        updateData: {
            type: ErrorType;
            severity: ErrorSeverity;
            httpMethod: HttpMethod;
            errorMessage: string;
            stackTrace: string;
            requestPath: string;
        };
    }): ErrorLog {
        return new ErrorLog({
            id: existingLog.getId(),
            type: updateData.type ?? existingLog.getType(),
            errorMessage: updateData.errorMessage ?? existingLog.getErrorMessage(),
            stackTrace: updateData.stackTrace ?? existingLog.getStackTrace(),
            requestPath: updateData.requestPath ?? existingLog.getRequestPath(),
            httpMethod: updateData.httpMethod ?? existingLog.getHttpMethod(),
            severity: updateData.severity ?? existingLog.getSeverity(),
            createdDate: existingLog.getCreatedDate(),
            createdById: existingLog.getCreatedById(),
            modifiedDate: existingLog.getModifiedDate(),
            modifiedById: currentUser.getId()!,
        });
    }
}
