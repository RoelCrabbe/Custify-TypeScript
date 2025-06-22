import { ErrorHttpMethod, ErrorStatus, isValidErrorHttpMethod } from '@errorLog/enums';
import { ErrorLog } from '@errorLog/errorLog';
import { CustifyError, ValidationError } from '@errorLog/exceptions';
import { errorLogRepository, errorLogService } from '@errorLog/index';
import { ErrorLogInput, JwtToken } from '@types';
import { userService } from '@user/index';
import { capitalizeFirstLetter } from '@utils/string';
import { Request } from 'express';

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
    if (auth) currentUser = await userService.getCurrentUser({ auth });

    const rawMethod = capitalizeFirstLetter(req.method);
    const httpMethod: ErrorHttpMethod = isValidErrorHttpMethod(rawMethod) ? rawMethod : 'Get';

    const createdErrorLog = ErrorLog.create({
        createUser: currentUser,
        createData: {
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

    const existingErrorLog = await errorLogService.getErrorLogById({ errorLogId: id });
    const currentUser = await userService.getCurrentUser({ auth });

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
        updateUser: currentUser,
        updateData: errorData,
        updateEntity: existingErrorLog,
    });

    return await errorLogRepository.upsertErrorLog({ errorLog: updatedErrorLog });
};
