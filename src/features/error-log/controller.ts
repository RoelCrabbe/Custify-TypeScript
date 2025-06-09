import { errorLogService } from '@error-log/index';
import express, { NextFunction, Request, Response } from 'express';

const errorLogRouter = express.Router();

errorLogRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await errorLogService.getAllNewErrorLogs();
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

export default errorLogRouter;
