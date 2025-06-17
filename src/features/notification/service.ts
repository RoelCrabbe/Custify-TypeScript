import { NotFoundError } from '@error-log/exceptions';
import { Notification, notificationRepository } from '@notification';
import { JwtToken, NotificationInput } from '@types';
import { userService } from '@user/index';
import { getCurrentUser } from '@user/service';

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
    return notificationRepository.getByUserId({ recipientById: userId });
};

export const getByCurrentUser = async ({ auth }: { auth: JwtToken }): Promise<Notification[]> => {
    const { userId } = auth;
    return await getByUserId({ userId });
};

export const createNotification = async ({
    notificationInput,
    auth,
}: {
    notificationInput: NotificationInput;
    auth: JwtToken;
}): Promise<Notification> => {
    const { title, body, status, category, priority, sentById, recipientById } = notificationInput;

    let sender = undefined;
    if (sentById) {
        sender = await userService.getUserById({ userId: sentById });
    }

    const recipient = await userService.getUserById({ userId: recipientById });
    const currentUser = await getCurrentUser({ auth });

    const newNotification = Notification.create({
        currentUser: currentUser,
        notificationData: {
            title,
            body,
            category,
            priority,
            status,
            sender,
            recipient,
        },
    });

    return await notificationRepository.upsertNotification({
        notification: newNotification,
    });
};
