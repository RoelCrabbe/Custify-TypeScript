import { authService } from '@auth/index';
import express, { NextFunction, Request, Response } from 'express';

const authRouter = express.Router();

authRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await authService.loginUser(<any>req.body);
        res.status(200).json({ message: 'Login Successfully', ...response });
    } catch (error) {
        next(error);
    }
});

authRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await authService.registerUser(<any>req.body);
        res.status(201).json({ message: 'Register Successfully', ...response });
    } catch (error) {
        next(error);
    }
});

export default authRouter;
