import { CustifyError } from '@error-log/exceptions';
import { errorLogRepository, ErrorStatus, HttpMethod, isValidMethod } from '@error-log/index';
import { ErrorLog } from '@error-log/model';
import { JwtToken } from '@types';
import { getCurrentUser } from '@user/service';
import { capitalizeFirstLetter } from '@utils/string';
import { Request } from 'express';

export const getAllNewErrorLogs = async (): Promise<ErrorLog[]> => {
    return await errorLogRepository.getAllNewErrorLogs();
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
    const httpMethod: HttpMethod = isValidMethod(rawMethod) ? rawMethod : 'Get';

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
