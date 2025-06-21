import database from '@config/prismaClient';
import {
    ErrorHttpMethod,
    ErrorLog,
    errorLogRepository,
    ErrorSeverity,
    ErrorStatus,
    ErrorType,
} from '@error-log';
import { User } from '@user';
import casual from 'casual';

const errorTypes = Object.values(ErrorType);
const errorSeverities = Object.values(ErrorSeverity);
const httpMethods = Object.values(ErrorHttpMethod);
const errorStatuses = Object.values(ErrorStatus);

const generateStackTrace = (errorType: string, message: string): string => {
    const fileNames = [
        'auth.js',
        'user.js',
        'app.js',
        'index.js',
        'db.js',
        'session.js',
        'logger.js',
    ];
    const modulePaths = [
        'D:\\Projects\\Custify\\dist\\',
        'C:\\Users\\dev\\Repos\\api\\build\\',
        '/usr/src/app/dist/',
        '/app/server/build/',
    ];
    const funcNames = [
        'loginUser',
        'createAccount',
        'getUserData',
        'verifyToken',
        'fetchSession',
        'handleError',
        'connectDatabase',
        'logToFile',
        'checkPermissions',
        'parseCookies',
        'initMiddleware',
    ];

    const modulePath = casual.random_element(modulePaths);
    const errorHeader = `${errorType}: ${message}`;
    const stackLines: string[] = [errorHeader];

    const stackDepth = casual.integer(6, 12);

    for (let i = 0; i < stackDepth; i++) {
        const file = casual.random_element(fileNames);
        const func = casual.random_element(funcNames);
        const line = casual.integer(10, 999);
        const col = casual.integer(10, 120);
        const asyncPrefix = Math.random() > 0.4 ? 'async ' : '';
        const classPrefix = Math.random() > 0.7 ? 'Module.' : 'Object.';

        stackLines.push(
            `    at ${asyncPrefix}${classPrefix}${func} (${modulePath}${file}:${line}:${col})`,
        );
    }

    stackLines.push(`    at processTicksAndRejections (node:internal/process/task_queues:96:5)`);

    return stackLines.join('\n');
};

export const createFakeErrorLogs = async (customUsers: User[], randomUsers: User[]) => {
    await database.errorLog.deleteMany();

    const createdErrorLogs = await Promise.all(
        Array.from({ length: 50 }).map(async () => {
            const customUser = casual.random_element(customUsers) as User;
            const randomUser = casual.random_element(randomUsers) as User;
            const status = casual.random_element(errorStatuses);

            let newErrorLog = ErrorLog.create({
                createUser: randomUser,
                createData: {
                    type: casual.random_element(errorTypes),
                    severity: casual.random_element(errorSeverities),
                    httpMethod: casual.random_element(httpMethods),
                    errorMessage: casual.sentence,
                    requestPath: casual.url,
                    status: status,
                    stackTrace: generateStackTrace(
                        casual.random_element(errorTypes),
                        casual.sentence,
                    ),
                },
            });

            if (newErrorLog.getStatus() === ErrorStatus.Resolved) {
                newErrorLog = ErrorLog.update({
                    updateUser: customUser,
                    updateData: {
                        type: newErrorLog.getType(),
                        severity: newErrorLog.getSeverity(),
                        httpMethod: newErrorLog.getHttpMethod(),
                        errorMessage: newErrorLog.getErrorMessage(),
                        stackTrace: newErrorLog.getStackTrace(),
                        requestPath: newErrorLog.getRequestPath(),
                        status: newErrorLog.getStatus(),
                        resolvedById: customUser.getId(),
                        resolvedDate: new Date(),
                    },
                    updateEntity: newErrorLog,
                });
            }

            return await errorLogRepository.upsertErrorLog({ errorLog: newErrorLog });
        }),
    );

    const validErrorLogs = createdErrorLogs.filter(
        (n): n is NonNullable<typeof n> => n !== undefined,
    );

    return {
        errorLogs: validErrorLogs,
    };
};
