import { AuthenticationError } from '@errorLog/exceptions';
import { AuthenticationResponse, UserInput } from '@types';
import { User, isActiveUserStatus, userRepository, userService } from '@user';
import { generateJwtToken } from '@utils/jwt';
import bcrypt from 'bcryptjs';

export const loginUser = async ({
    userInput,
}: {
    userInput: UserInput;
}): Promise<AuthenticationResponse> => {
    const { userName, passWord } = userInput;
    const fUser = await userService.getUserByUserName({ userName });

    const isCorrectPassword = await bcrypt.compare(passWord, fUser.getPassWord());
    if (!isCorrectPassword) throw new AuthenticationError('Invalid credentials.');

    if (!isActiveUserStatus(fUser.getStatus()))
        throw new AuthenticationError('Account is inactive. Contact management.');

    return {
        token: generateJwtToken({
            userId: fUser.getId()!,
            role: fUser.getRole(),
        }),
    };
};

export const registerUser = async ({
    userInput,
}: {
    userInput: UserInput;
}): Promise<AuthenticationResponse> => {
    const { firstName, lastName, email, phoneNumber, userName, passWord } = userInput;

    await userService.registrationAssertUserNotExists({ email, userName });
    const hashedPassword = await bcrypt.hash(passWord, 12);

    const createdUser = User.create({
        currentUser: null,
        userData: {
            firstName,
            lastName,
            email,
            phoneNumber,
            userName,
            passWord: hashedPassword,
        },
    });

    const nUser = await userRepository.upsertUser({ user: createdUser });

    return {
        token: generateJwtToken({
            userId: nUser.getId()!,
            role: nUser.getRole(),
        }),
    };
};
