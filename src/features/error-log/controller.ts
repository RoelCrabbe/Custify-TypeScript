import { errorLogService } from '@error-log/index';
import { ErrorLogInput, JwtToken } from '@types';
import express, { NextFunction, Request, Response } from 'express';

const errorLogRouter = express.Router();

errorLogRouter.get('/new', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await errorLogService.getAllNewErrorLogs();
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

errorLogRouter.get('/reviewed', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await errorLogService.getAllReviewedErrorLogs();
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

errorLogRouter.get('/resolved', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await errorLogService.getAllResolvedErrorLogs();
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

errorLogRouter.put('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errorLog = <ErrorLogInput>req.body;
        const header = req as Request & { auth: JwtToken };
        const response = await errorLogService.updateErrorLog({
            errorLogInput: errorLog,
            auth: header.auth,
        });
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

export default errorLogRouter;
