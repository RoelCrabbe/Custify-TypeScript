import database from '@config/prismaClient';
import { ErrorLog } from '@middleware/model';

export const createErrorLog = async (errorLog: ErrorLog): Promise<ErrorLog> => {
    try {
        const errorLogPrisma = await database.errorLog.create({
            data: {
                type: errorLog.getType(),
                errorMessage: errorLog.getErrorMessage(),
                stackTrace: errorLog.getStackTrace(),
                requestPath: errorLog.getRequestPath(),
                httpMethod: errorLog.getHttpMethod(),
                isExpectedFailure: errorLog.getIsExpectedFailure(),
                createdDate: errorLog.getCreatedDate(),
                createdById: errorLog.getCreatedById(),
                modifiedDate: errorLog.getModifiedDate(),
                modifiedById: errorLog.getModifiedById(),
            },
        });

        return ErrorLog.from(errorLogPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export const updateErrorLog = async (errorLog: ErrorLog): Promise<ErrorLog> => {
    try {
        const errorLogPrisma = await database.errorLog.update({
            where: { id: errorLog.getId() },
            data: {
                type: errorLog.getType(),
                errorMessage: errorLog.getErrorMessage(),
                stackTrace: errorLog.getStackTrace(),
                requestPath: errorLog.getRequestPath(),
                httpMethod: errorLog.getHttpMethod(),
                isExpectedFailure: errorLog.getIsExpectedFailure(),
                createdDate: errorLog.getCreatedDate(),
                createdById: errorLog.getCreatedById(),
                modifiedDate: errorLog.getModifiedDate(),
                modifiedById: errorLog.getModifiedById(),
            },
        });

        return ErrorLog.from(errorLogPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};
