import * as bodyParser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import { expressjwt } from 'express-jwt';
import helmet from 'helmet';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { userRouter } from './controller/user.routes';
import { processEnv } from './utils/processEnv';

const app = express();
app.use(helmet());

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            connectSrc: ["'self'", 'https://api.ucll.be'],
        },
    }),
);

dotenv.config();
const publicApiPort = processEnv.getApiUrl();
const publicFrontEndPort = processEnv.getBaseUrl();

app.use(
    cors({
        origin: publicFrontEndPort,
    }),
    bodyParser.json(),
);

app.use(
    expressjwt({
        secret: processEnv.getJwtSecret(),
        algorithms: ['HS256'],
    }).unless({
        path: ['/api-docs', /^\/api-docs\/.*/, '/users/login', '/users/register'],
    }),
);

app.use('/users', userRouter);

app.get('/status', (req, res) => {
    res.json({ message: 'Custify-TypeScript Running...' });
});

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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ status: 'Unauthorized', message: err.message });
    } else if (err.name === 'NotFoundError') {
        res.status(404).json({ status: 'Not Found', message: err.message });
    } else {
        res.status(400).json({ status: 'Application Error', message: err.message });
    }
});

app.listen(3000, () => {
    console.log(`Custify-TypeScript Running on port ${publicApiPort}.`);
    console.log(`Swagger running on ${publicApiPort}/api-docs.`);
});
