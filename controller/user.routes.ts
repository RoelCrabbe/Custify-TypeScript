import { userService } from '@services/user.service';
import { JwtToken } from '@types';
import express, { NextFunction, Request, Response } from 'express';

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

export { userRouter };
