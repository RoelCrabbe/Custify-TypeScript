import { authRouter } from '@auth/index';
import errorLogRouter from '@error-log/controller';
import { handleErrorMiddleware } from '@error-log/handler';
import { processEnv } from '@shared/index';
import userRouter from '@user/controller';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import { expressjwt } from 'express-jwt';
import helmet from 'helmet';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const app = express();

const publicApiPort = processEnv.getApiPort();
const publicFrontEndUrl = processEnv.getBaseUrl();

const swaggerOpts = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Custify-TypeScript',
            version: '0.0.1',
        },
    },
    apis: ['./controller/*.routes.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOpts);

app.use(helmet());

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            connectSrc: ["'self'", 'https://api.ucll.be'],
        },
    }),
);

app.use(
    cors({
        origin: publicFrontEndUrl,
    }),
    bodyParser.json(),
);

app.get('/status', (req, res) => {
    res.json({ message: 'Custify-TypeScript Running...' });
});

app.use('/auth', authRouter);

app.use(
    expressjwt({
        secret: processEnv.getJwtSecret(),
        algorithms: ['HS256'],
    }).unless({
        path: ['/api-docs', /^\/api-docs\/.*/],
    }),
);

app.use('/users', userRouter);
app.use('/error-logs', errorLogRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(async (err: Error, req: Request, res: Response, next: NextFunction) => {
    await handleErrorMiddleware({ err, req, res, next });
});

app.listen(publicApiPort, () => {
    console.log(`Custify-TypeScript Running on port ${publicApiPort}.`);
});
