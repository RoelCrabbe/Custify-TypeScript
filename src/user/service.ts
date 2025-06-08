import { JwtToken, UserInput } from '@types';
import { userRepository, userService } from '@user/index';
import { User } from '@user/model';
import bcrypt from 'bcryptjs';
import { AuthenticationError, NotFoundError, ValidationError } from 'shared';

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

export const registrationAssertUserNotExists = async ({
    email,
    userName,
}: {
    email: string;
    userName: string;
}): Promise<void> => {
    const [userByName, userByEmail] = await Promise.all([
        userRepository.getUserByUserName({ userName }),
        userRepository.getUserByEmail({ email }),
    ]);

    if (userByName) {
        throw new AuthenticationError(`User with username <${userName}> already exists.`);
    }
    if (userByEmail) {
        throw new AuthenticationError(`User with email <${email}> already exists.`);
    }
};

export const updateAssertUserNotExists = async ({
    email,
    userName,
    excludeUserId,
}: {
    email?: string;
    userName?: string;
    excludeUserId: number;
}): Promise<void> => {
    if (userName) {
        const userByName = await userRepository.getUserByUserName({ userName, excludeUserId });
        if (userByName) {
            throw new ValidationError(`User with username <${userName}> already exists.`);
        }
    }

    if (email) {
        const userByEmail = await userRepository.getUserByEmail({ email, excludeUserId });
        if (userByEmail) {
            throw new ValidationError(`User with email <${email}> already exists.`);
        }
    }
};

export const updateUser = async ({
    userInput,
    auth,
}: {
    userInput: UserInput;
    auth: JwtToken;
}): Promise<User> => {
    if (!userInput.id) throw new ValidationError('User id is required');

    const { id, firstName, lastName, email, phoneNumber, userName, passWord, role, status } =
        userInput;

    const existingUser = await userService.getUserById({ userId: id });
    const currentUser = await getCurrentUser({ auth });

    if (email && email !== existingUser.getEmail()) {
        await userService.updateAssertUserNotExists({ email, excludeUserId: id });
    }

    if (userName && userName !== existingUser.getUserName()) {
        await userService.updateAssertUserNotExists({ userName, excludeUserId: id });
    }

    let hashedPassword;
    if (passWord && passWord.trim()) hashedPassword = await bcrypt.hash(passWord, 12);

    const updatedUser = User.update({
        currentUser,
        existingUser,
        updateData: {
            firstName,
            lastName,
            email,
            phoneNumber,
            userName,
            passWord: hashedPassword || existingUser.getPassWord(),
            role,
            status,
        },
    });

    return await userRepository.updateUser(updatedUser);
};
