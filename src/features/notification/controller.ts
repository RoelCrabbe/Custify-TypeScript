import { notificationService } from '@notification/index';
import { JwtToken } from '@types';
import express, { NextFunction, Request, Response } from 'express';

const notificationRouter = express.Router();

notificationRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const header = req as Request & { auth: JwtToken };
        const response = await notificationService.getByCurrentUser(header);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

export default notificationRouter;
