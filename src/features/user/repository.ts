import database from '@config/prismaClient';
import { User } from '@user';

export const getAllUsers = async (): Promise<User[]> => {
    try {
        const usersPrisma = await database.user.findMany({
            orderBy: { id: 'asc' },
            include: {
                profileImage: true,
            },
        });

        return usersPrisma.map((user: any) => User.from(user));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export const getUserByUserName = async ({
    userName,
    excludeUserId,
}: {
    userName: string;
    excludeUserId?: number;
}): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findFirst({
            where: {
                userName,
                ...(excludeUserId && { id: { not: excludeUserId } }),
            },
            include: {
                profileImage: true,
            },
        });

        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export const getUserByEmail = async ({
    email,
    excludeUserId,
}: {
    email: string;
    excludeUserId?: number;
}): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findFirst({
            where: {
                email,
                ...(excludeUserId && { id: { not: excludeUserId } }),
            },
            include: {
                profileImage: true,
            },
        });

        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export const getUserById = async ({ id }: { id: number }): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findFirst({
            where: { id },
            include: {
                profileImage: true,
            },
        });

        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export const upsertUser = async ({ user }: { user: User }): Promise<User> => {
    try {
        const userPrisma = await database.user.upsert({
            where: { userName: user.getUserName() },
            update: {
                userName: user.getUserName(),
                firstName: user.getFirstName(),
                lastName: user.getLastName(),
                email: user.getEmail(),
                passWord: user.getPassWord(),
                role: user.getRole(),
                status: user.getStatus(),
                phoneNumber: user.getPhoneNumber(),
                createdDate: user.getCreatedDate(),
                createdById: user.getCreatedById(),
                modifiedById: user.getModifiedById(),
            },
            create: {
                userName: user.getUserName(),
                firstName: user.getFirstName(),
                lastName: user.getLastName(),
                email: user.getEmail(),
                passWord: user.getPassWord(),
                role: user.getRole(),
                status: user.getStatus(),
                phoneNumber: user.getPhoneNumber(),
                createdById: user.getCreatedById(),
            },
            include: {
                profileImage: true,
            },
        });

        return User.from(userPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};
