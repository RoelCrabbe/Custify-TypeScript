import database from '@config/prismaClient';
import { ErrorLog, ErrorStatus } from '@error-log';
import { Prisma } from '@prisma/client';

export const getAllByStatus = async (status: ErrorStatus): Promise<ErrorLog[]> => {
    try {
        const results = await database.errorLog.findMany({
            where: { status },
            orderBy: {
                id: 'asc',
            },
        });

        return results.map((x: any) => ErrorLog.from(x));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export const upsertErrorLog = async ({ errorLog }: { errorLog: ErrorLog }): Promise<ErrorLog> => {
    try {
        const errorLogId = errorLog.getId();
        let errorLogValue = null;

        if (!errorLogId) {
            errorLogValue = await database.errorLog.create({
                data: {
                    type: errorLog.getType(),
                    severity: errorLog.getSeverity(),
                    httpMethod: errorLog.getHttpMethod(),
                    errorMessage: errorLog.getErrorMessage(),
                    stackTrace: errorLog.getStackTrace(),
                    requestPath: errorLog.getRequestPath(),
                    status: errorLog.getStatus(),
                    resolvedById: errorLog.getResolvedById(),
                    resolvedDate: errorLog.getResolvedDate(),
                    createdById: errorLog.getCreatedById(),
                },
            });
        } else {
            errorLogValue = await database.errorLog.upsert({
                where: { id: errorLogId },
                update: {
                    type: errorLog.getType(),
                    severity: errorLog.getSeverity(),
                    httpMethod: errorLog.getHttpMethod(),
                    errorMessage: errorLog.getErrorMessage(),
                    stackTrace: errorLog.getStackTrace(),
                    requestPath: errorLog.getRequestPath(),
                    status: errorLog.getStatus(),
                    resolvedById: errorLog.getResolvedById(),
                    resolvedDate: errorLog.getResolvedDate(),
                    createdDate: errorLog.getCreatedDate(),
                    createdById: errorLog.getCreatedById(),
                    modifiedById: errorLog.getModifiedById(),
                },
                create: {
                    type: errorLog.getType(),
                    severity: errorLog.getSeverity(),
                    httpMethod: errorLog.getHttpMethod(),
                    errorMessage: errorLog.getErrorMessage(),
                    stackTrace: errorLog.getStackTrace(),
                    requestPath: errorLog.getRequestPath(),
                    status: errorLog.getStatus(),
                    resolvedById: errorLog.getResolvedById(),
                    resolvedDate: errorLog.getResolvedDate(),
                    createdById: errorLog.getCreatedById(),
                },
            });
        }

        return ErrorLog.from(errorLogValue);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export const getErrorLogById = async ({ id }: { id: number }): Promise<ErrorLog | null> => {
    try {
        const result = await database.errorLog.findFirst({
            where: { id },
        });

        return result ? ErrorLog.from(result) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export const deleteResolvedErrorLogsOlderThan = async (
    cutoffDate: Date,
): Promise<Prisma.BatchPayload> => {
    try {
        const result = await database.errorLog.deleteMany({
            where: {
                status: ErrorStatus.Resolved,
                resolvedDate: {
                    lt: cutoffDate,
                },
            },
        });

        return result;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};
