import { errorLogService } from '@error-log';
import { CustifyError } from '@error-log/exceptions';
import { JwtToken } from '@types';
import { Request, Response } from 'express';

export const handleErrorMiddleware = async ({
    err,
    req,
    res,
}: {
    err: Error;
    req: Request;
    res: Response;
}) => {
    if (err instanceof CustifyError) {
        const header = req as Request & { auth: JwtToken };
        await errorLogService.createErrorLog({ err, req, auth: header.auth });

        return res.status(err.getStatusCode()).json({
            status: err.getType(),
            message: err.getMessage(),
        });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ status: 'Unauthorized', message: err.message });
    }

    return res.status(400).json({ status: 'Application Error', message: err.message });
};
