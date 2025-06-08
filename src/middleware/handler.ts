import { CustifyError } from '@middleware/exceptions/index';
import { errorLogService } from '@middleware/index';
import { JwtToken } from '@types';
import { NextFunction, Request, Response } from 'express';

export const handleErrorMiddleware = async ({
    err,
    req,
    res,
    next,
}: {
    err: Error;
    req: Request;
    res: Response;
    next: NextFunction;
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
