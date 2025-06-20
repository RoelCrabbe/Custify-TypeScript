import { AuthenticationError, NotFoundError, ValidationError } from '@errorLog/exceptions';
import { JwtToken, UpdatePassWordInput, UserInput } from '@types';
import { User, userRepository } from '@user';
import { userImageService } from '@userImage/index';
import bcrypt from 'bcryptjs';

export const getAllUsers = async (): Promise<User[]> => {
    return await userRepository.getAllUsers();
};

export const getCurrentUser = async ({ auth }: { auth: JwtToken }): Promise<User> => {
    const { userId } = auth;
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

    const { id, firstName, lastName, email, phoneNumber, userName, role, status, userImage } =
        userInput;

    const existingUser = await getUserById({ userId: id });
    const currentUser = await getCurrentUser({ auth });

    if (email && email !== existingUser.getEmail()) {
        await updateAssertUserNotExists({ email, excludeUserId: id });
    }

    if (userName && userName !== existingUser.getUserName()) {
        await updateAssertUserNotExists({ userName, excludeUserId: id });
    }

    const updatedUser = User.update({
        updateUser: currentUser,
        updateData: {
            firstName,
            lastName,
            email,
            phoneNumber,
            userName,
            passWord: existingUser.getPassWord(),
            role,
            status,
        },
        updateEntity: existingUser,
    });

    if (userImage) {
        await userImageService.createOrUpdateUserImage({
            actionUser: currentUser,
            userImageInput: userImage,
            user: updatedUser,
        });
    }

    return await userRepository.upsertUser({ user: updatedUser });
};

export const changePassWord = async ({
    updatePassWordInput,
    auth,
}: {
    updatePassWordInput: UpdatePassWordInput;
    auth: JwtToken;
}): Promise<User> => {
    const { currentPassWord, newPassWord, confirmPassWord } = updatePassWordInput;
    const currentUser = await getCurrentUser({ auth });

    if (newPassWord !== confirmPassWord)
        throw new ValidationError('New password and confirmation do not match');

    const isCorrectPassword = await bcrypt.compare(currentPassWord, currentUser.getPassWord());
    if (!isCorrectPassword) throw new AuthenticationError('Invalid credentials.');

    const hashedPassword = await bcrypt.hash(newPassWord, 12);

    const updatedUser = User.update({
        updateUser: currentUser,
        updateData: {
            firstName: currentUser.getFirstName(),
            lastName: currentUser.getLastName(),
            email: currentUser.getEmail(),
            phoneNumber: currentUser.getPhoneNumber(),
            userName: currentUser.getUserName(),
            passWord: hashedPassword,
            role: currentUser.getRole(),
            status: currentUser.getStatus(),
        },
        updateEntity: currentUser,
    });

    return await userRepository.upsertUser({ user: updatedUser });
};
