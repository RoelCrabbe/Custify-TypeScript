import { notificationService } from '@notification/index';
import { JwtToken, NotificationInput } from '@types';
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

notificationRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notification = <NotificationInput>req.body;
        const header = req as Request & { auth: JwtToken };
        const response = await notificationService.createNotification({
            notificationInput: notification,
            auth: header.auth,
        });
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
});

notificationRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = Number(req.params.id);
        const response = await notificationService.getUnreadProfilePictureReports({ userId });
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

export default notificationRouter;
