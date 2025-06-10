import { authService } from '@auth/index';
import { UserInput } from '@types';
import express, { NextFunction, Request, Response } from 'express';

const authRouter = express.Router();

authRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = <UserInput>req.body;
        const response = await authService.loginUser({ userInput: user });
        res.status(201).json({ message: 'Login Successfully', ...response });
    } catch (error) {
        next(error);
    }
});

authRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = <UserInput>req.body;
        const response = await authService.registerUser({ userInput: user });
        res.status(201).json({ message: 'Register Successfully', ...response });
    } catch (error) {
        next(error);
    }
});

export default authRouter;
