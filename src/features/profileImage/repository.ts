import database from '@config/prismaClient';
import { ProfileImage } from '@profileImage/index';

export const upsertProfileImage = async ({
    userId,
    profileImage,
}: {
    userId: number;
    profileImage: ProfileImage;
}): Promise<ProfileImage> => {
    try {
        const profileImagePrisma = await database.profileImage.upsert({
            where: { userId },
            update: {
                fileName: profileImage.fileName,
                mimeType: profileImage.mimeType,
                fileSize: profileImage.fileSize,
                url: profileImage.url,
                altText: profileImage.altText,
            },
            create: {
                userId,
                fileName: profileImage.fileName,
                mimeType: profileImage.mimeType,
                fileSize: profileImage.fileSize,
                url: profileImage.url,
                altText: profileImage.altText,
            },
        });

        return ProfileImage.from(profileImagePrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};
