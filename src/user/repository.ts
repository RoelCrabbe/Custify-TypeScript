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
}: {
    userName: string;
}): Promise<User | null> => {
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
                role: user.getRole(),
                passWord: user.getPassWord(),
                isActive: user.getIsActive(),
                phoneNumber: user.getPhoneNumber(),
            },
        });

        return User.from(userPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export const getUniqueUser = async ({
    email,
    userName,
}: {
    email: string;
    userName: string;
}): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findFirst({
            where: {
                OR: [{ email }, { userName }],
            },
        });

        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};
