import { NotFoundError } from '@errorLog/exceptions';
import { Notification, notificationRepository } from '@notification/index';
import { JwtToken } from '@types';

/**
 * This function retrieves notifications for a specific user by their user ID.
 * @param  - The `getByUserId` function is an asynchronous function that takes an object as a parameter
 * with a property `userId` of type number. It returns a Promise that resolves to an array of
 * `Notification` objects. Inside the function, it calls `notificationRepository.getByUserId` with an
 * object containing the
 * @returns An array of `Notification` objects is being returned.
 */
export const getByUserId = async ({ userId }: { userId: number }): Promise<Notification[]> => {
    return notificationRepository.getByUserId({ recipientById: userId });
};

/**
 * The function `getByCurrentUser` retrieves notifications for the current user based on their
 * authentication token.
 * @param  - The `getByCurrentUser` function takes an object as a parameter with a property `auth` of
 * type `JwtToken`. The function returns a promise that resolves to an array of `Notification` objects.
 * @returns The `getByCurrentUser` function is returning a Promise that resolves to an array of
 * `Notification` objects.
 */
export const getByCurrentUser = async ({ auth }: { auth: JwtToken }): Promise<Notification[]> => {
    const { userId } = auth;
    return await getByUserId({ userId });
};

/**
 * The functions retrieve notifications by ID and unread profile picture reports by user ID from a
 * repository.
 * @param  - The `getNotificationById` function retrieves a notification by its `notificationId`, while
 * the `getUnreadProfilePictureReports` function retrieves unread profile picture reports for a
 * specific `userId`.
 * @returns The `getNotificationById` function returns a single `Notification` object based on the
 * provided `notificationId`. The `getUnreadProfilePictureReports` function returns an array of
 * `Notification` objects representing unread profile picture reports for a specific `userId`.
 */
export const getNotificationById = async ({
    notificationId,
}: {
    notificationId: number;
}): Promise<Notification> => {
    const notification = await notificationRepository.getNotificationById({ id: notificationId });
    if (!notification)
        throw new NotFoundError(`Notification with id <${notificationId}> does not exist.`);
    return notification;
};

/**
 * This function retrieves unread profile picture reports for a specific user ID.
 * @param  - The `getUnreadProfilePictureReports` function takes an object as a parameter with a
 * `userId` property of type number. It returns a Promise that resolves to an array of `Notification`
 * objects.
 * @returns The function `getUnreadProfilePictureReports` is returning a Promise that resolves to an
 * array of `Notification` objects.
 */
export const getUnreadProfilePictureReports = async ({
    userId,
}: {
    userId: number;
}): Promise<Notification[]> => {
    return await notificationRepository.getUnreadProfilePictureReportsByUserId({
        recipientById: userId,
    });
};
