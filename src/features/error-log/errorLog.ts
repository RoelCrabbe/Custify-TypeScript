import { EntityBase } from '@base/entityBase';
import { ErrorHttpMethod, ErrorSeverity, ErrorStatus, ErrorType } from '@error-log/enums';
import { ValidationError } from '@error-log/exceptions';
import { PrismaErrorLog } from '@prisma/index';
import { User } from '@user';

export class ErrorLog extends EntityBase {
    public readonly type: ErrorType;
    public readonly severity: ErrorSeverity;
    public readonly httpMethod: ErrorHttpMethod;
    public readonly errorMessage: string;
    public readonly stackTrace: string;
    public readonly requestPath: string;
    public readonly status: ErrorStatus;
    public readonly resolvedById?: number;
    public readonly resolvedDate?: Date;

    constructor(log: {
        type: ErrorType;
        severity: ErrorSeverity;
        httpMethod: ErrorHttpMethod;
        errorMessage: string;
        stackTrace: string;
        requestPath: string;
        status: ErrorStatus;
        resolvedById?: number;
        resolvedDate?: Date;
        id?: number;
        createdById?: number;
        createdDate?: Date;
        modifiedById?: number;
        modifiedDate?: Date;
    }) {
        super(log);

        this.type = log.type;
        this.errorMessage = log.errorMessage;
        this.stackTrace = log.stackTrace;
        this.requestPath = log.requestPath;
        this.httpMethod = log.httpMethod;
        this.severity = log.severity;
        this.status = log.status;
        this.resolvedById = log.resolvedById;
        this.resolvedDate = log.resolvedDate;
        this.validate(log);
    }

    private validate(log: {
        type: ErrorType;
        severity: ErrorSeverity;
        httpMethod: ErrorHttpMethod;
        errorMessage: string;
        stackTrace: string;
        requestPath: string;
        status: ErrorStatus;
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
        if (!log.status?.trim()) {
            throw new ValidationError('ErrorLog validation: Status is required');
        }
    }

    getType(): ErrorType {
        return this.type;
    }

    getSeverity(): ErrorSeverity {
        return this.severity;
    }

    getHttpMethod(): ErrorHttpMethod {
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

    getStatus(): ErrorStatus {
        return this.status;
    }

    getResolvedById(): number | undefined {
        return this.resolvedById;
    }

    getResolvedDate(): Date | undefined {
        return this.resolvedDate;
    }

    equals(log: ErrorLog): boolean {
        return (
            this.type === log.getType() &&
            this.severity === log.getSeverity() &&
            this.httpMethod === log.getHttpMethod() &&
            this.errorMessage === log.getErrorMessage() &&
            this.stackTrace === log.getStackTrace() &&
            this.requestPath === log.getRequestPath() &&
            this.status === log.getStatus()
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
            status: this.status,
            resolvedById: this.resolvedById,
            resolvedDate: this.resolvedDate,
            createdById: this.getCreatedById(),
            createdDate: this.getCreatedDate(),
            modifiedById: this.getModifiedById(),
            modifiedDate: this.getModifiedDate(),
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
        status,
        resolvedById,
        resolvedDate,
        createdById,
        createdDate,
        modifiedById,
        modifiedDate,
    }: PrismaErrorLog): ErrorLog {
        return new ErrorLog({
            id,
            type: type as ErrorType,
            severity: severity as ErrorSeverity,
            httpMethod: httpMethod as ErrorHttpMethod,
            errorMessage,
            stackTrace,
            requestPath,
            status: status as ErrorStatus,
            resolvedById: resolvedById || undefined,
            resolvedDate: resolvedDate || undefined,
            createdById: createdById || undefined,
            createdDate: createdDate || undefined,
            modifiedById: modifiedById || undefined,
            modifiedDate: modifiedDate || undefined,
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
            httpMethod: ErrorHttpMethod;
            errorMessage: string;
            stackTrace: string;
            requestPath: string;
            status: ErrorStatus;
        };
    }): ErrorLog {
        return new ErrorLog({
            ...errorData,
            createdById: currentUser?.getId() ?? undefined,
        });
    }

    static update({
        currentUser,
        existingErrorLog,
        errorData,
    }: {
        currentUser: User;
        existingErrorLog: ErrorLog;
        errorData: {
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
    }): ErrorLog {
        return new ErrorLog({
            id: existingErrorLog.getId(),
            type: errorData.type ?? existingErrorLog.getType(),
            errorMessage: errorData.errorMessage ?? existingErrorLog.getErrorMessage(),
            stackTrace: errorData.stackTrace ?? existingErrorLog.getStackTrace(),
            requestPath: errorData.requestPath ?? existingErrorLog.getRequestPath(),
            httpMethod: errorData.httpMethod ?? existingErrorLog.getHttpMethod(),
            severity: errorData.severity ?? existingErrorLog.getSeverity(),
            status: errorData.status ?? existingErrorLog.getStatus(),
            resolvedById: errorData.resolvedById ?? existingErrorLog.getResolvedById(),
            resolvedDate: errorData.resolvedDate ?? existingErrorLog.getResolvedDate(),
            createdById: existingErrorLog.getCreatedById(),
            createdDate: existingErrorLog.getCreatedDate(),
            modifiedById: currentUser.getId()!,
        });
    }
}
