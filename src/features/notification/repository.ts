import database from '@config/prismaClient';
import { Notification } from '@notification';

export const getNotificationById = async ({ id }: { id: number }): Promise<Notification | null> => {
    try {
        const result = await database.notification.findFirst({
            where: { id },
            include: {
                sender: true,
                recipient: true,
            },
        });

        return result ? Notification.from(result) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export const getByUserId = async ({
    recipientById,
}: {
    recipientById: number;
}): Promise<Notification[]> => {
    try {
        const results = await database.notification.findMany({
            where: { recipientById, readDate: null },
            orderBy: {
                sentDate: 'desc',
            },
            include: {
                sender: true,
                recipient: true,
            },
        });

        return results.map((x: any) => Notification.from(x));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export const upsertNotification = async ({
    notification,
}: {
    notification: Notification;
}): Promise<Notification> => {
    try {
        const notificationId = notification.getId();
        const senderById = notification.getSender()?.getId();
        const recipientById = notification.getRecipient().getId();
        let notificationValue = null;

        if (!notificationId) {
            notificationValue = await database.notification.create({
                data: {
                    title: notification.getTitle(),
                    body: notification.getBody(),
                    status: notification.getStatus(),
                    category: notification.getCategory(),
                    priority: notification.getPriority(),
                    readDate: notification.getReadDate(),
                    sender: senderById
                        ? {
                              connect: { id: senderById },
                          }
                        : undefined,
                    recipient: {
                        connect: { id: recipientById },
                    },
                    createdById: notification.getCreatedById(),
                },
                include: {
                    sender: true,
                    recipient: true,
                },
            });
        } else {
            notificationValue = await database.notification.upsert({
                where: { id: notificationId },
                update: {
                    title: notification.getTitle(),
                    body: notification.getBody(),
                    status: notification.getStatus(),
                    category: notification.getCategory(),
                    priority: notification.getPriority(),
                    sentDate: notification.getSentDate(),
                    readDate: notification.getReadDate(),
                    sender: senderById
                        ? {
                              connect: { id: senderById },
                          }
                        : undefined,
                    recipient: {
                        connect: { id: recipientById },
                    },
                    createdDate: notification.getCreatedDate(),
                    createdById: notification.getCreatedById(),
                    modifiedById: notification.getModifiedById(),
                },
                create: {
                    title: notification.getTitle(),
                    body: notification.getBody(),
                    status: notification.getStatus(),
                    category: notification.getCategory(),
                    priority: notification.getPriority(),
                    readDate: notification.getReadDate(),
                    sender: senderById
                        ? {
                              connect: { id: senderById },
                          }
                        : undefined,
                    recipient: {
                        connect: { id: recipientById },
                    },
                    createdById: notification.getCreatedById(),
                },
                include: {
                    sender: true,
                    recipient: true,
                },
            });
        }

        return Notification.from(notificationValue);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};
