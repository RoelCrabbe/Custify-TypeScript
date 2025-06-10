import { CustifyError, NotFoundError, ValidationError } from '@error-log/exceptions';
import {
    ErrorHttpMethod,
    errorLogRepository,
    ErrorStatus,
    isValidErrorHttpMethod,
} from '@error-log/index';
import { ErrorLog } from '@error-log/model';
import { ErrorLogInput, JwtToken } from '@types';
import { getCurrentUser } from '@user/service';
import { capitalizeFirstLetter } from '@utils/string';
import { Request } from 'express';

export const getAllNewErrorLogs = async (): Promise<ErrorLog[]> => {
    return await errorLogRepository.getAllByStatus(ErrorStatus.New);
};

export const getAllReviewedErrorLogs = async (): Promise<ErrorLog[]> => {
    return await errorLogRepository.getAllByStatus(ErrorStatus.Reviewed);
};

export const getAllResolvedErrorLogs = async (): Promise<ErrorLog[]> => {
    return await errorLogRepository.getAllByStatus(ErrorStatus.Resolved);
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

    return await errorLogRepository.createErrorLog(
        ErrorLog.create({
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
        }),
    );
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
        isArchived,
        archivedBy,
        archivedDate,
    } = errorLogInput;

    const existingErrorLog = await getErrorLogById({ errorLogId: id });
    const currentUser = await getCurrentUser({ auth });

    const updatedErrorLog = ErrorLog.update({
        currentUser,
        existingErrorLog,
        updateData: {
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
        },
    });

    return await errorLogRepository.updateErrorLog(updatedErrorLog);
};
