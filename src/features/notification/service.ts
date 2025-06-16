import { NotFoundError } from '@error-log/exceptions';
import { Notification, notificationRepository } from '@notification';
import { JwtToken } from '@types';

export const getNotificationById = async ({
    notificationId,
}: {
    notificationId: number;
}): Promise<Notification> => {
    const notification = await notificationRepository.getNotificationById({ id: notificationId });
    if (!notification) {
        throw new NotFoundError(`Notification with id <${notificationId}> does not exist.`);
    }
    return notification;
};

export const getByUserId = async ({ userId }: { userId: number }): Promise<Notification[]> => {
    return notificationRepository.getByUserId({ recipientId: userId });
};

export const getByCurrentUser = async ({ auth }: { auth: JwtToken }): Promise<Notification[]> => {
    const { userId } = auth;
    return await getByUserId({ userId });
};
