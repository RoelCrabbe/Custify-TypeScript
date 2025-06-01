import { AuthenticationResponse } from '@types';
import { userRepository, userService } from '@user/index';
import { User } from '@user/model';
import { generateJwtToken } from '@utils/jwt';
import bcrypt from 'bcryptjs';

export const loginUser = async (userInput: any): Promise<AuthenticationResponse> => {
    const { userName, passWord } = userInput;
    const user = await userService.getUserByUserName({ userName });

    const isValidPassword = await bcrypt.compare(passWord, user.getPassWord());
    if (!isValidPassword) throw new Error('Invalid credentials.');

    return {
        token: generateJwtToken({
            userId: user.getId()!,
            role: user.getRole(),
        }),
    };
};

export const registerUser = async (userInput: any): Promise<AuthenticationResponse> => {
    const { firstName, lastName, email, phoneNumber, userName, passWord } = userInput;

    const existingUser = await userRepository.getUniqueUser({
        email,
        userName,
    });

    if (existingUser) {
        if (existingUser.getEmail() === email) {
            throw new Error(`User with email <${email}> already exists.`);
        }

        if (existingUser.getUserName() === userName) {
            throw new Error(`User with username <${userName}> already exists.`);
        }
    }

    const hashedPassword = await bcrypt.hash(passWord, 12);

    const newUser = User.create({
        userName,
        firstName,
        lastName,
        email,
        passWord: hashedPassword,
        phoneNumber,
    });

    const createdUser = await userRepository.createUser(newUser);

    return {
        token: generateJwtToken({
            userId: createdUser.getId()!,
            role: createdUser.getRole(),
        }),
    };
};
