import { AuthenticationError, ValidationError } from '@errorLog/exceptions';
import { profileImageService } from '@profileImage/index';
import { JwtToken, UpdatePassWordInput, UserInput } from '@types';
import { User, userRepository, userService } from '@user/index';
import bcrypt from 'bcryptjs';

export const updateUser = async ({
    userInput,
    auth,
}: {
    userInput: UserInput;
    auth: JwtToken;
}): Promise<User> => {
    if (!userInput.id) throw new ValidationError('User id is required');

    const { id, firstName, lastName, email, phoneNumber, userName, role, status, profileImage } =
        userInput;

    const existingUser = await userService.getUserById({ userId: id });
    const currentUser = await userService.getCurrentUser({ auth });

    if (email && email !== existingUser.getEmail()) {
        await userService.assertUserNotExistsForUpdate({ email, excludeUserId: id });
    }

    if (userName && userName !== existingUser.getUserName()) {
        await userService.assertUserNotExistsForUpdate({ userName, excludeUserId: id });
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

    if (profileImage) {
        await profileImageService.createOrUpdateProfileImage({
            actionUser: currentUser,
            profileImageInput: profileImage,
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
    const currentUser = await userService.getCurrentUser({ auth });

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
