import { CustifyError } from '@exceptions/index';
import { errorLogRepository } from '@middleware/index';
import { ErrorLog } from '@middleware/model';
import { JwtToken } from '@types';
import { getCurrentUser } from '@user/service';
import { Request } from 'express';

export const createErrorLog = async ({
    err,
    req,
    auth,
}: {
    err: Error;
    req: Request;
    auth: JwtToken;
}): Promise<ErrorLog> => {
    let currentUser = null;
    if (auth) currentUser = await getCurrentUser({ auth });

    return await errorLogRepository.createErrorLog(
        ErrorLog.create({
            currentUser,
            errorData: {
                type: err.name,
                errorMessage: err.message,
                stackTrace: err.stack || '',
                requestPath: req.url,
                httpMethod: req.method,
                isExpectedFailure: (err instanceof CustifyError) as boolean,
            },
        }),
    );
};
