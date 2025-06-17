import database from '@config/prismaClient';
import {
    Notification,
    NotificationCategory,
    NotificationPriority,
    notificationRepository,
    NotificationStatus,
} from '@notification';
import { User } from '@user/user';
import casual from 'casual';

const notificationStatus = Object.values(NotificationStatus);
const notificationCategory = Object.values(NotificationCategory);
const notificationPriority = Object.values(NotificationPriority);

export const createFakeNotifications = async (users: User[]) => {
    await database.notification.deleteMany();

    const createdNotifications = await Promise.all(
        Array.from({ length: 300 }).map(async () => {
            const sender = casual.random_element(users) as User;
            const recipientCandidates = users.filter((u) => u.getId() !== sender.getId());
            const recipient = casual.random_element(recipientCandidates) as User;

            const newNotification = Notification.create({
                currentUser: sender,
                notificationData: {
                    title: casual.title,
                    body: casual.sentences(2),
                    status: casual.random_element(notificationStatus),
                    category: casual.random_element(notificationCategory),
                    priority: casual.random_element(notificationPriority),
                    recipient: recipient,
                },
            });

            return notificationRepository.upsertNotification({ notification: newNotification });
        }),
    );

    const validNotifications = createdNotifications.filter(
        (n): n is NonNullable<typeof n> => n !== undefined,
    );

    return {
        notifications: validNotifications,
    };
};
