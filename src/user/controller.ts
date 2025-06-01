import { JwtToken } from '@types';
import { userService } from '@user/index';
import express, { NextFunction, Request, Response } from 'express';

const userRouter = express.Router();

userRouter.get('/current', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reqHeader = req as Request & { auth: JwtToken };
        const response = await userService.getCurrentUser({
            auth: reqHeader.auth,
        });
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reqHeader = req as Request & { auth: JwtToken };
        const response = await userService.getAllUsers();
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

export default userRouter;
