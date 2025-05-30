import bcrypt from 'bcrypt';
import { User } from '../model/user';
import { userDb } from '../repository/user.db';
import { generateJwtToken } from '../repository/utils/jwt';
import { AuthenticationResponse, JwtToken, Role } from '../types';

const getUserByUserName = async ({ userName }: { userName: string }): Promise<User> => {
    const user = await userDb.getUserByUserName({ userName });
    if (!user) {
        throw new Error(`User with username <${userName}> does not exist.`);
    }
    return user;
};

const getUserById = async ({ userId }: { userId: number }): Promise<User> => {
    const user = await userDb.getUserById({ id: userId });
    if (!user) {
        throw new Error(`User with id <${userId}> does not exist.`);
    }
    return user;
};

const loginUser = async (userInput: any): Promise<AuthenticationResponse> => {
    const { userName, passWord } = userInput;
    const user = await getUserByUserName({ userName });

    const isValidPassword = await bcrypt.compare(passWord, user.getPassWord());
    if (!isValidPassword) throw new Error('Invalid credentials.');

    return {
        token: generateJwtToken({ userId: user.getId()!, role: user.getRole() }),
    };
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
        token: generateJwtToken({ userId: createdUser.getId()!, role: createdUser.getRole() }),
    };
};

const getCurrentUser = async ({ auth }: { auth: JwtToken }): Promise<User> => {
    const { role, userId } = auth;
    console.log(role, userId);
    return await getUserById({ userId });
};

export const userService = {
    getUserByUserName,
    getUserById,
    registerUser,
    loginUser,
    getCurrentUser,
};
