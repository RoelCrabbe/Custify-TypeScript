import { AuthenticationError, ValidationError } from '@errorLog/exceptions';
import { userRepository } from '@user/index';

/**
 * The function `assertUserNotExistsForRegistration` checks if a user with a given email or username
 * already exists before allowing registration.
 * @param  - The `assertUserNotExistsForRegistration` function is used to check if a user with a given
 * email or username already exists before allowing registration. It takes an object as a parameter
 * with `email` and `userName` properties, both of type string. The function then queries the database
 * to check if
 */
export const assertUserNotExistsForRegistration = async ({
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

    if (userByName)
        throw new AuthenticationError(`User with username <${userName}> already exists.`);
    if (userByEmail) throw new AuthenticationError(`User with email <${email}> already exists.`);
};

/**
 * The function `assertUserNotExistsForUpdate` checks if a user with a given email or username already
 * exists, excluding a specific user ID.
 * @param  - The `assertUserNotExistsForUpdate` function is used to check if a user with a given email
 * or username already exists in the system, excluding a specific user ID. The function takes the
 * following parameters:
 */
export const assertUserNotExistsForUpdate = async ({
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
        if (userByName)
            throw new ValidationError(`User with username <${userName}> already exists.`);
    }

    if (email) {
        const userByEmail = await userRepository.getUserByEmail({ email, excludeUserId });
        if (userByEmail) throw new ValidationError(`User with email <${email}> already exists.`);
    }
};
