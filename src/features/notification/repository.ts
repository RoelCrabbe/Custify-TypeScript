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
    recipientId,
}: {
    recipientId: number;
}): Promise<Notification[]> => {
    try {
        const results = await database.notification.findMany({
            where: { recipientId, readDate: null },
            orderBy: {
                sentDate: 'desc',
            },
            include: {
                sender: true,
            },
        });

        return results.map((x: any) => Notification.from(x));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};
