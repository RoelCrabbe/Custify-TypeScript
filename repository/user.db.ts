import { User } from '@models/user';
import database from './utils/database';

const getAllUsers = async (): Promise<User[]> => {
    try {
        const usersPrisma = await database.user.findMany({ orderBy: { id: 'asc' } });
        return usersPrisma.map((user: any) => User.from(user));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getUserByUserName = async ({ userName }: { userName: string }): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findFirst({
            where: { userName },
        });

        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getUserById = async ({ id }: { id: number }): Promise<User | null> => {
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

const getUsersByIds = async ({ userIds }: { userIds: number[] }): Promise<User[]> => {
    try {
        const users = await database.user.findMany({
            where: {
                id: { in: userIds },
            },
        });

        return users.map((user: any) => User.from(user));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const createUser = async (user: User): Promise<User> => {
    try {
        const userPrisma = await database.user.create({
            data: {
                userName: user.getUserName(),
                firstName: user.getFirstName(),
                lastName: user.getLastName(),
                email: user.getEmail(),
                role: user.getRole(),
                passWord: user.getPassWord(),
            },
        });

        return User.from(userPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export const userDb = {
    getAllUsers,
    getUserByUserName,
    getUserById,
    getUsersByIds,
    createUser,
};
