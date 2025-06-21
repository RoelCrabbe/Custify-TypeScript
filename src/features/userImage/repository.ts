import database from '@config/prismaClient';
import { UserImage } from '@user';

export const upsertUserImage = async ({
    userId,
    userImage,
}: {
    userId: number;
    userImage: UserImage;
}): Promise<UserImage> => {
    try {
        const userImagePrisma = await database.userImage.upsert({
            where: { userId },
            update: {
                fileName: userImage.fileName,
                mimeType: userImage.mimeType,
                fileSize: userImage.fileSize,
                url: userImage.url,
                altText: userImage.altText,
            },
            create: {
                userId,
                fileName: userImage.fileName,
                mimeType: userImage.mimeType,
                fileSize: userImage.fileSize,
                url: userImage.url,
                altText: userImage.altText,
            },
        });

        return UserImage.from(userImagePrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};
