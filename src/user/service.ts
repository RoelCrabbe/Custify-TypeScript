import { JwtToken, UserInput } from '@types';
import { userRepository, userService } from '@user/index';
import { User } from '@user/model';
import bcrypt from 'bcryptjs';
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
    excludeUserId,
}: {
    email?: string;
    userName?: string;
    excludeUserId?: number;
}): Promise<void> => {
    if (userName) {
        const user_name = await userRepository.getUserByUserName({ userName, excludeUserId });
        if (user_name) throw new Error(`User with username <${userName}> already exists.`);
    }
    if (email) {
        const user_email = await userRepository.getUserByEmail({ email, excludeUserId });
        if (user_email) throw new Error(`User with email <${email}> already exists.`);
    }
};

export const updateUser = async ({
    userInput,
    auth,
}: {
    userInput: UserInput;
    auth: JwtToken;
}): Promise<User> => {
    if (!userInput.id) throw new Error('User id is required');

    const { id, firstName, lastName, email, phoneNumber, userName, passWord, role, status } =
        userInput;

    const existingUser = await userService.getUserById({ userId: id });
    const currentUser = await getCurrentUser({ auth });

    if (email && email !== existingUser.getEmail()) {
        await userService.assertUserNotExists({ email, excludeUserId: id });
    }

    if (userName && userName !== existingUser.getUserName()) {
        await userService.assertUserNotExists({ userName, excludeUserId: id });
    }

    let hashedPassword;
    if (passWord && passWord.trim()) hashedPassword = await bcrypt.hash(passWord, 12);

    const updatedUser = User.update(existingUser, {
        firstName,
        lastName,
        email,
        phoneNumber,
        userName,
        passWord: hashedPassword || existingUser.getPassWord(),
        role,
        status,
        modifiedById: currentUser.getId(),
    });

    return await userRepository.updateUser(updatedUser);
};
