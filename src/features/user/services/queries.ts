import { NotFoundError } from '@errorLog/exceptions';
import { JwtToken } from '@types';
import { User, userRepository } from '@user/index';

/**
 * The function getAllUsers retrieves all users from the repository asynchronously.
 * @returns The `getAllUsers` function is returning a promise that resolves to an array of `User`
 * objects.
 */
export const getAllUsers = async (): Promise<User[]> => {
    return await userRepository.getAllUsers();
};

/**
 * The function `getUserById` retrieves a user by their ID and throws a `NotFoundError` if the user
 * does not exist.
 * @param  - The `getUserById` function is an asynchronous function that takes an object as a parameter
 * with a property `userId` of type number. It returns a Promise that resolves to a `User` object.
 * @returns The function `getUserById` is returning a `Promise` that resolves to a `User` object
 * fetched from the `userRepository` based on the provided `userId`. If the user is not found, a
 * `NotFoundError` is thrown with a message indicating that the user with the specified id does not
 * exist.
 */
export const getUserById = async ({ userId }: { userId: number }): Promise<User> => {
    const user = await userRepository.getUserById({ id: userId });
    if (!user) throw new NotFoundError(`User with id <${userId}> does not exist.`);
    return user;
};

/**
 * The function getCurrentUser retrieves the current user based on the provided JWT token.
 * @param  - The `getCurrentUser` function takes an object as a parameter with a property `auth` of
 * type `JwtToken`. The `auth` object contains the `userId` property, which is used to fetch the user
 * details by calling the `getUserById` function with the `userId` as an argument
 * @returns The `getCurrentUser` function is returning a `Promise` that resolves to a `User` object.
 */
export const getCurrentUser = async ({ auth }: { auth: JwtToken }): Promise<User> => {
    const { userId } = auth;
    return await getUserById({ userId });
};

/**
 * This function retrieves a user by their username and throws a NotFoundError if the user does not
 * exist.
 * @param  - The function `getUserByUserName` is an asynchronous function that takes an object as a
 * parameter with a property `userName` of type string. It returns a Promise that resolves to a `User`
 * object.
 * @returns The function `getUserByUserName` is returning a `Promise` that resolves to a `User` object.
 */
export const getUserByUserName = async ({ userName }: { userName: string }): Promise<User> => {
    const user = await userRepository.getUserByUserName({ userName });
    if (!user) throw new NotFoundError(`User with username <${userName}> does not exist.`);
    return user;
};
