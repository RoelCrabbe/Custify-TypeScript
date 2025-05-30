import bcrypt from 'bcrypt';
import { User } from '../model/user';
import { userDb } from '../repository/user.db';
import { generateJwtToken } from '../repository/utils/jwt';
import { AuthenticationResponse, Role } from '../types';

const getUserByUserName = async ({ userName }: { userName: string }): Promise<User> => {
    const user = await userDb.getUserByUserName({ userName });
    if (!user) {
        throw new Error(`User with username <${userName}> does not exist.`);
    }
    return user;
};

const registerUser = async (userInput: any): Promise<AuthenticationResponse> => {
    const { userName, passWord, firstName, lastName, email } = userInput;

    const existingUser = await userDb.getUserByUserName({ userName });
    if (existingUser) throw new Error(`User with username <${userName}> already exists.`);

    const hashedPassword = await bcrypt.hash(passWord, 12);

    const newUser = new User({
        userName,
        firstName,
        lastName,
        email,
        passWord: hashedPassword,
        role: Role.USER,
    });

    const createdUser = await userDb.createUser(newUser);

    return {
        userId: createdUser.getId(),
        token: generateJwtToken({ userId: createdUser.getId()!, role: createdUser.getRole() }),
        userName: createdUser.getUserName(),
        fullName: `${createdUser.getFirstName()} ${createdUser.getLastName()}`,
        role: createdUser.getRole(),
    };
};

const loginUser = async (userInput: any): Promise<AuthenticationResponse> => {
    const { userName, passWord } = userInput;
    const user = await getUserByUserName({ userName });

    const isValidPassword = await bcrypt.compare(passWord, user.getPassWord());
    if (!isValidPassword) throw new Error('Invalid credentials.');

    return {
        userId: user.getId(),
        token: generateJwtToken({ userId: user.getId()!, role: user.getRole() }),
        userName: user.getUserName(),
        fullName: `${user.getFirstName()} ${user.getLastName()}`,
        role: user.getRole(),
    };
};

export const userService = {
    getUserByUserName,
    registerUser,
    loginUser,
};
