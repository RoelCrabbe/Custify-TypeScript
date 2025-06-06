import database from '@config/prismaClient';
import { User } from '@user/model';

export const getAllUsers = async (): Promise<User[]> => {
    try {
        const usersPrisma = await database.user.findMany({ orderBy: { id: 'asc' } });
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
        });

        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export const createUser = async (user: User): Promise<User> => {
    try {
        const userPrisma = await database.user.create({
            data: {
                userName: user.getUserName(),
                firstName: user.getFirstName(),
                lastName: user.getLastName(),
                email: user.getEmail(),
                passWord: user.getPassWord(),
                role: user.getRole(),
                status: user.getStatus(),
                phoneNumber: user.getPhoneNumber(),
            },
        });

        return User.from(userPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export const updateUser = async (user: User): Promise<User> => {
    try {
        const userPrisma = await database.user.update({
            where: { id: user.getId() },
            data: {
                userName: user.getUserName(),
                firstName: user.getFirstName(),
                lastName: user.getLastName(),
                email: user.getEmail(),
                passWord: user.getPassWord(),
                role: user.getRole(),
                status: user.getStatus(),
                phoneNumber: user.getPhoneNumber(),
            },
        });

        return User.from(userPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};
