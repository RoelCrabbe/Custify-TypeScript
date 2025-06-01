import { JwtToken } from '@types';
import { userRepository } from '@user/index';
import { User } from '@user/model';
import { NotFoundError } from 'shared';

export const getAllUsers = async (): Promise<User[]> => {
    return await userRepository.getAllUsers();
};

export const getCurrentUser = async ({ auth }: { auth: JwtToken }): Promise<User> => {
    const { role, userId } = auth;
    return await getUserById({ userId });
};

export const getUserByUserName = async ({ userName }: { userName: string }): Promise<User> => {
    const user = await userRepository.getUserByUserName({ userName });
    if (!user) {
        throw new NotFoundError(`User with username <${userName}> does not exist.`);
    }
    return user;
};

export const getUserById = async ({ userId }: { userId: number }): Promise<User> => {
    const user = await userRepository.getUserById({ id: userId });
    if (!user) {
        throw new Error(`User with id <${userId}> does not exist.`);
    }
    return user;
};
