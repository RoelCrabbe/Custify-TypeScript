import {
    ErrorHttpMethod,
    ErrorLog,
    ErrorStatus,
    errorLogRepository,
    isValidErrorHttpMethod,
} from '@error-log';
import { CustifyError, NotFoundError, ValidationError } from '@error-log/exceptions';
import { ErrorLogInput, JwtToken } from '@types';
import { getCurrentUser } from '@user/service';
import { capitalizeFirstLetter } from '@utils/string';
import { Request } from 'express';

const ARCHIVE_RETENTION_DAYS = 90;

export const getAllNewErrorLogs = async (): Promise<ErrorLog[]> => {
    return await errorLogRepository.getAllByStatus(ErrorStatus.New);
};

export const getAllReviewedErrorLogs = async (): Promise<ErrorLog[]> => {
    return await errorLogRepository.getAllByStatus(ErrorStatus.Reviewed);
};

export const getAllResolvedErrorLogs = async (): Promise<ErrorLog[]> => {
    return await errorLogRepository.getAllByStatus(ErrorStatus.Resolved);
};

export const cleanupArchivedErrorLogs = async (): Promise<number> => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - ARCHIVE_RETENTION_DAYS);
    return (await errorLogRepository.deleteResolvedErrorLogsOlderThan(cutoffDate)).count;
};

export const createErrorLog = async ({
    err,
    req,
    auth,
}: {
    err: CustifyError;
    req: Request;
    auth: JwtToken;
}): Promise<ErrorLog> => {
    let currentUser = null;
    if (auth) currentUser = await getCurrentUser({ auth });

    const rawMethod = capitalizeFirstLetter(req.method);
    const httpMethod: ErrorHttpMethod = isValidErrorHttpMethod(rawMethod) ? rawMethod : 'Get';

    const createdErrorLog = ErrorLog.create({
        currentUser,
        errorData: {
            type: err.getType(),
            severity: err.getSeverity(),
            httpMethod,
            errorMessage: err.getMessage(),
            stackTrace: err.stack || 'No StackTrace Available',
            requestPath: req.url,
            status: ErrorStatus.New,
        },
    });

    return await errorLogRepository.upsertErrorLog({ errorLog: createdErrorLog });
};

export const getErrorLogById = async ({
    errorLogId,
}: {
    errorLogId: number;
}): Promise<ErrorLog> => {
    const errorLog = await errorLogRepository.getErrorLogById({ id: errorLogId });
    if (!errorLog) {
        throw new NotFoundError(`ErrorLog with id <${errorLogId}> does not exist.`);
    }
    return errorLog;
};

export const updateErrorLog = async ({
    errorLogInput,
    auth,
}: {
    errorLogInput: ErrorLogInput;
    auth: JwtToken;
}): Promise<ErrorLog> => {
    if (!errorLogInput.id) throw new ValidationError('ErrorLog id is required');

    const {
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
    } = errorLogInput;

    const existingErrorLog = await getErrorLogById({ errorLogId: id });
    const currentUser = await getCurrentUser({ auth });

    const errorData = {
        type,
        severity,
        httpMethod,
        errorMessage,
        stackTrace,
        requestPath,
        status,
        resolvedById,
        resolvedDate,
    };

    if (status === ErrorStatus.Resolved) {
        errorData.resolvedById = currentUser.getId();
        errorData.resolvedDate = new Date();
    }

    const updatedErrorLog = ErrorLog.update({
        currentUser,
        existingErrorLog,
        errorData,
    });

    return await errorLogRepository.upsertErrorLog({ errorLog: updatedErrorLog });
};
