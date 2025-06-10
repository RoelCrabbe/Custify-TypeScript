import { EntityBase } from '@base/entityBase';
import { ErrorHttpMethod, ErrorSeverity, ErrorStatus, ErrorType } from '@error-log/enums';
import { ValidationError } from '@error-log/exceptions';
import { PrismaErrorLog } from '@prisma/index';
import { User } from '@user/model';

export class ErrorLog extends EntityBase {
    public readonly type: ErrorType;
    public readonly severity: ErrorSeverity;
    public readonly httpMethod: ErrorHttpMethod;
    public readonly errorMessage: string;
    public readonly stackTrace: string;
    public readonly requestPath: string;
    public readonly status: ErrorStatus;
    public readonly isArchived?: boolean;
    public readonly archivedBy?: number;
    public readonly archivedDate?: Date;

    constructor(log: {
        type: ErrorType;
        severity: ErrorSeverity;
        httpMethod: ErrorHttpMethod;
        errorMessage: string;
        stackTrace: string;
        requestPath: string;
        status: ErrorStatus;
        isArchived?: boolean;
        archivedBy?: number;
        archivedDate?: Date;
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
        this.status = log.status;
        this.isArchived = log.isArchived || false;
        this.archivedBy = log.archivedBy;
        this.archivedDate = log.archivedDate;
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

    getIsArchived(): boolean | undefined {
        return this.isArchived;
    }

    getArchivedBy(): number | undefined {
        return this.archivedBy;
    }

    getArchivedDate(): Date | undefined {
        return this.archivedDate;
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
            isArchived: this.isArchived,
            archivedBy: this.archivedBy,
            archivedDate: this.archivedDate,
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
        status,
        isArchived,
        archivedBy,
        archivedDate,
        createdDate,
        modifiedDate,
        createdById,
        modifiedById,
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
            isArchived: isArchived || false,
            archivedBy: archivedBy || undefined,
            archivedDate: archivedDate || undefined,
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
        updateData,
    }: {
        currentUser: User;
        existingErrorLog: ErrorLog;
        updateData: {
            type: ErrorType;
            severity: ErrorSeverity;
            httpMethod: ErrorHttpMethod;
            errorMessage: string;
            stackTrace: string;
            requestPath: string;
            status: ErrorStatus;
            isArchived?: boolean;
            archivedBy?: number;
            archivedDate?: Date;
        };
    }): ErrorLog {
        return new ErrorLog({
            id: existingErrorLog.getId(),
            type: updateData.type ?? existingErrorLog.getType(),
            errorMessage: updateData.errorMessage ?? existingErrorLog.getErrorMessage(),
            stackTrace: updateData.stackTrace ?? existingErrorLog.getStackTrace(),
            requestPath: updateData.requestPath ?? existingErrorLog.getRequestPath(),
            httpMethod: updateData.httpMethod ?? existingErrorLog.getHttpMethod(),
            severity: updateData.severity ?? existingErrorLog.getSeverity(),
            status: updateData.status ?? existingErrorLog.getStatus(),
            isArchived: updateData.isArchived ?? existingErrorLog.getIsArchived(),
            archivedBy: updateData.archivedBy ?? existingErrorLog.getArchivedBy(),
            archivedDate: updateData.archivedDate ?? existingErrorLog.getArchivedDate(),
            createdDate: existingErrorLog.getCreatedDate(),
            createdById: existingErrorLog.getCreatedById(),
            modifiedDate: existingErrorLog.getModifiedDate(),
            modifiedById: currentUser.getId()!,
        });
    }
}
