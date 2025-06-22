import { ErrorStatus } from '@errorLog/enums';
import { NotFoundError } from '@errorLog/exceptions';
import { ErrorLog, errorLogRepository } from '@errorLog/index';

/**
 * This function retrieves all new error logs from the error log repository.
 * @returns An array of `ErrorLog` objects with the status of `New` is being returned.
 */
export const getAllNewErrorLogs = async (): Promise<ErrorLog[]> => {
    return await errorLogRepository.getAllByStatus(ErrorStatus.New);
};

/**
 * This function retrieves all error logs that have been reviewed.
 * @returns An array of ErrorLog objects that have the status "Reviewed" from the errorLogRepository.
 */
export const getAllReviewedErrorLogs = async (): Promise<ErrorLog[]> => {
    return await errorLogRepository.getAllByStatus(ErrorStatus.Reviewed);
};

/**
 * This function retrieves all resolved error logs from the error log repository.
 * @returns An array of resolved error logs is being returned.
 */
export const getAllResolvedErrorLogs = async (): Promise<ErrorLog[]> => {
    return await errorLogRepository.getAllByStatus(ErrorStatus.Resolved);
};

/**
 * This function retrieves an error log by its ID and throws a NotFoundError if the log does not exist.
 * @param  - The `getErrorLogById` function takes an object as a parameter with a property `errorLogId`
 * of type number. This function retrieves an error log by its ID from a repository and returns it. If
 * the error log with the specified ID does not exist, it throws a `NotFoundError` with
 * @returns The function `getErrorLogById` is returning a Promise that resolves to an `ErrorLog`
 * object.
 */
export const getErrorLogById = async ({
    errorLogId,
}: {
    errorLogId: number;
}): Promise<ErrorLog> => {
    const errorLog = await errorLogRepository.getErrorLogById({ id: errorLogId });
    if (!errorLog) throw new NotFoundError(`ErrorLog with id <${errorLogId}> does not exist.`);
    return errorLog;
};
