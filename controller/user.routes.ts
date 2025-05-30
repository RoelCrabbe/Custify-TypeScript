import express, { NextFunction, Request, Response } from 'express';
import { userService } from '../service/user.service';

const userRouter = express.Router();

userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await userService.loginUser(<any>req.body);
        res.status(200).json({ message: 'Login Successfully', ...response });
    } catch (error) {
        next(error);
    }
});

userRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await userService.registerUser(<any>req.body);
        res.status(201).json({ message: 'Register Successfully', ...response });
    } catch (error) {
        next(error);
    }
});

export { userRouter };
