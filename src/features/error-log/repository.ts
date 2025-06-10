import database from '@config/prismaClient';
import { ErrorStatus } from '@error-log/enums';
import { ErrorLog } from '@error-log/model';

export const getAllByStatus = async (status: ErrorStatus): Promise<ErrorLog[]> => {
    try {
        const errorLogPrisma = await database.errorLog.findMany({
            where: {
                status: status,
            },
            orderBy: {
                id: 'asc',
            },
        });
        return errorLogPrisma.map((errorLog: any) => ErrorLog.from(errorLog));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export const createErrorLog = async (errorLog: ErrorLog): Promise<ErrorLog> => {
    try {
        const errorLogPrisma = await database.errorLog.create({
            data: {
                type: errorLog.getType(),
                severity: errorLog.getSeverity(),
                httpMethod: errorLog.getHttpMethod(),
                errorMessage: errorLog.getErrorMessage(),
                stackTrace: errorLog.getStackTrace(),
                requestPath: errorLog.getRequestPath(),
                status: errorLog.getStatus(),
                isArchived: errorLog.getIsArchived(),
                archivedBy: errorLog.getArchivedBy(),
                archivedDate: errorLog.getArchivedDate(),
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
                severity: errorLog.getSeverity(),
                httpMethod: errorLog.getHttpMethod(),
                errorMessage: errorLog.getErrorMessage(),
                stackTrace: errorLog.getStackTrace(),
                requestPath: errorLog.getRequestPath(),
                status: errorLog.getStatus(),
                isArchived: errorLog.getIsArchived(),
                archivedBy: errorLog.getArchivedBy(),
                archivedDate: errorLog.getArchivedDate(),
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

export const getErrorLogById = async ({ id }: { id: number }): Promise<ErrorLog | null> => {
    try {
        const errorLogPrisma = await database.errorLog.findFirst({
            where: { id },
        });

        return errorLogPrisma ? ErrorLog.from(errorLogPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};
