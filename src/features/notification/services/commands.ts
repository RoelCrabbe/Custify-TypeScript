import { NotFoundError, ValidationError } from '@errorLog/exceptions';
import { NotificationStatus } from '@notification/enums';
import { Notification, notificationRepository, notificationService } from '@notification/index';
import { JwtToken, NotificationInput } from '@types';
import { userService } from '@user/index';

export const markAllAsRead = async ({ auth }: { auth: JwtToken }): Promise<Notification[]> => {
    const currentUser = await userService.getCurrentUser({ auth });
    const unreadNotifications = await notificationService.getByUserId({
        userId: currentUser.getId()!,
    });

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

    const currentUser = await userService.getCurrentUser({ auth });
    const unreadNotification = await notificationService.getNotificationById({ notificationId });

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
    const currentUser = await userService.getCurrentUser({ auth });

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
