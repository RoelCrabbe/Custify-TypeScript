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
        throw new NotFoundError(`User with id <${userId}> does not exist.`);
    }
    return user;
};

export const assertUserNotExists = async ({
    email,
    userName,
}: {
    email: string;
    userName: string;
}): Promise<void> => {
    const user_name = await userRepository.getUserByUserName({ userName });
    if (user_name) throw new Error(`User with username <${userName}> already exists.`);
    const user_email = await userRepository.getUserByEmail({ email });
    if (user_email) throw new Error(`User with email <${email}> already exists.`);
};
