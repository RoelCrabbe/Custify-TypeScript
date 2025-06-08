import { EntityBase } from '@base/entityBase';
import { SeverityType, ValidationError } from '@exceptions/index';
import { ErrorLog as PrismaErrorLog } from '@prisma/client';
import { User } from '@user/model';

export class ErrorLog extends EntityBase {
    public readonly type: string;
    public readonly errorMessage: string;
    public readonly stackTrace: string;
    public readonly requestPath: string;
    public readonly httpMethod: string;
    public readonly severity: SeverityType;

    constructor(log: {
        type: string;
        errorMessage: string;
        stackTrace: string;
        requestPath: string;
        httpMethod: string;
        severity: SeverityType;
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
        type: string;
        errorMessage: string;
        stackTrace: string;
        requestPath: string;
        httpMethod: string;
    }): void {
        if (!log.type?.trim()) {
            throw new ValidationError('ErrorLog validation: Type is required');
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
        if (!log.httpMethod?.trim()) {
            throw new ValidationError('ErrorLog validation: Http Method is required');
        }
    }

    getType(): string {
        return this.type;
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

    getHttpMethod(): string {
        return this.httpMethod;
    }

    getSeverity(): SeverityType {
        return this.severity;
    }

    equals(log: ErrorLog): boolean {
        return (
            this.type === log.getType() &&
            this.errorMessage === log.getErrorMessage() &&
            this.stackTrace === log.getStackTrace() &&
            this.requestPath === log.getRequestPath() &&
            this.httpMethod === log.getHttpMethod() &&
            this.severity === log.getSeverity()
        );
    }

    toJSON() {
        return {
            id: this.getId(),
            type: this.type,
            errorMessage: this.errorMessage,
            stackTrace: this.stackTrace,
            requestPath: this.requestPath,
            httpMethod: this.httpMethod,
            severity: this.severity,
            createdDate: this.getCreatedDate(),
            modifiedDate: this.getModifiedDate(),
            createdById: this.getCreatedById(),
            modifiedById: this.getModifiedById(),
        };
    }

    static from({
        id,
        type,
        errorMessage,
        stackTrace,
        requestPath,
        httpMethod,
        severity,
        createdDate,
        modifiedDate,
        createdById,
        modifiedById,
    }: PrismaErrorLog): ErrorLog {
        return new ErrorLog({
            id,
            type,
            errorMessage,
            stackTrace,
            requestPath,
            httpMethod,
            severity: severity as SeverityType,
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
            type: string;
            errorMessage: string;
            stackTrace: string;
            requestPath: string;
            httpMethod: string;
            severity: SeverityType;
        };
    }): ErrorLog {
        return new ErrorLog({
            ...errorData,
            createdById: currentUser?.getId() ?? undefined,
            modifiedById: currentUser?.getId() ?? undefined,
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
            type: string;
            errorMessage: string;
            stackTrace: string;
            requestPath: string;
            httpMethod: string;
            severity: SeverityType;
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
