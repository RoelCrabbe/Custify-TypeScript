import { NotFoundError, ValidationError } from '@error-log/exceptions';
import { Notification, notificationRepository, NotificationStatus } from '@notification';
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
        createUser: currentUser,
        createData: {
            title,
            body,
            category,
            priority,
            status,
            recipient,
            sender,
        },
    });

    return await notificationRepository.upsertNotification({
        notification: newNotification,
    });
};

export const getUnreadProfilePictureReports = async ({
    userId,
}: {
    userId: number;
}): Promise<Notification[]> => {
    return await notificationRepository.getUnreadProfilePictureReportsByUserId({
        recipientById: userId,
    });
};

export const markAllAsRead = async ({ auth }: { auth: JwtToken }): Promise<Notification[]> => {
    const currentUser = await getCurrentUser({ auth });
    const unreadNotifications = await getByUserId({ userId: currentUser.getId()! });

    if (unreadNotifications.length === 0) throw new NotFoundError(`You have no unread messages.`);

    const readDate = new Date();
    const updatedNotifications = unreadNotifications.map((existingNotification) =>
        Notification.update({
            updateUser: currentUser,
            updateData: {
                title: existingNotification.getTitle(),
                body: existingNotification.getBody(),
                category: existingNotification.getCategory(),
                priority: existingNotification.getPriority(),
                status: NotificationStatus.Read,
                recipient: existingNotification.getRecipient(),
                readDate,
            },
            updateEntity: existingNotification,
        }),
    );

    return await Promise.all(
        updatedNotifications.map((notification) =>
            notificationRepository.upsertNotification({ notification }),
        ),
    );
};

export const markAsReadById = async ({
    notificationId,
    auth,
}: {
    notificationId: number;
    auth: JwtToken;
}): Promise<Notification> => {
    if (!notificationId) throw new ValidationError(`Notification id is required.`);

    const currentUser = await getCurrentUser({ auth });
    const unreadNotification = await getNotificationById({ notificationId });

    const recipientId = unreadNotification.getRecipient().getId();
    if (recipientId !== currentUser.getId())
        throw new ValidationError(`You are not the recipient of this notification.`);

    const readDate = new Date();
    const updatedNotifications = Notification.update({
        updateUser: currentUser,
        updateData: {
            title: unreadNotification.getTitle(),
            body: unreadNotification.getBody(),
            category: unreadNotification.getCategory(),
            priority: unreadNotification.getPriority(),
            status: NotificationStatus.Read,
            recipient: unreadNotification.getRecipient(),
            readDate,
        },
        updateEntity: unreadNotification,
    });

    return await notificationRepository.upsertNotification({ notification: updatedNotifications });
};
