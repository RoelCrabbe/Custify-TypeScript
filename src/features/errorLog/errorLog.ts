import { EntityBase } from '@base/entityBase';
import { ErrorHttpMethod, ErrorSeverity, ErrorStatus, ErrorType } from '@errorLog';
import { ValidationError } from '@errorLog/exceptions';
import { PrismaErrorLog } from '@prisma';
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

    protected validate(log: {
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
        createUser,
        createData,
    }: {
        createUser: User | null;
        createData: {
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
            ...createData,
            createdById: createUser?.getId(),
        });
    }

    static update({
        updateUser,
        updateData,
        updateEntity,
    }: {
        updateUser: User;
        updateData: {
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
        updateEntity: ErrorLog;
    }): ErrorLog {
        return new ErrorLog({
            id: updateEntity.getId(),
            type: updateData.type ?? updateEntity.getType(),
            errorMessage: updateData.errorMessage ?? updateEntity.getErrorMessage(),
            stackTrace: updateData.stackTrace ?? updateEntity.getStackTrace(),
            requestPath: updateData.requestPath ?? updateEntity.getRequestPath(),
            httpMethod: updateData.httpMethod ?? updateEntity.getHttpMethod(),
            severity: updateData.severity ?? updateEntity.getSeverity(),
            status: updateData.status ?? updateEntity.getStatus(),
            resolvedById: updateData.resolvedById ?? updateEntity.getResolvedById(),
            resolvedDate: updateData.resolvedDate ?? updateEntity.getResolvedDate(),
            createdById: updateEntity.getCreatedById(),
            createdDate: updateEntity.getCreatedDate(),
            modifiedById: updateUser.getId()!,
        });
    }
}
