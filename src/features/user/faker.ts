import database from '@config/prismaClient';
import { UserRole, UserStatus } from '@user/enums';
import { userRepository } from '@user/index';
import { User } from '@user/user';
import { UserImage } from '@user/userImage';
import bcrypt from 'bcryptjs';
import casual from 'casual';

const customUsers = [
    {
        firstName: 'Roel',
        lastName: 'Crabbé',
        userName: 'Roel_Crabbe',
        email: 'roel.crabbe@example.com',
        passWord: '@Roel_Crabbe123',
        phoneNumber: '061-234-5678',
        status: UserStatus.Active,
        role: UserRole.Admin,
    },
    {
        firstName: 'Daan',
        lastName: 'Crabbé',
        userName: 'Daan_Crabbe',
        email: 'daan.crabbe@example.com',
        passWord: '@Daan_Crabbe123',
        phoneNumber: '061-234-5678',
        status: UserStatus.Active,
        role: UserRole.Admin,
    },
];

export const createFakeUsers = async () => {
    await database.user.deleteMany();

    const createdCustomUsers = await Promise.all(
        customUsers.map(async (user) => {
            const hashedPassword = await bcrypt.hash(user.passWord, 12);

            const newUser = User.create({
                currentUser: null,
                userData: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    userName: user.userName,
                    passWord: hashedPassword,
                },
            });

            newUser.roleAdmin();

            return await userRepository.upsertUser({ user: newUser });
        }),
    );

    const createdRandomUsers = await Promise.all(
        Array.from({ length: 10 }).map(async () => {
            const firstName = casual.first_name;
            const lastName = casual.last_name;
            const userName = `${firstName}_${lastName}`;
            const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`;
            const plainPassword = `@${userName}123`;
            const hashedPassword = await bcrypt.hash(plainPassword, 12);

            const creatingUser = casual.random_element(createdCustomUsers) as User;

            const newUser = User.create({
                currentUser: creatingUser,
                userData: {
                    firstName,
                    lastName,
                    email,
                    phoneNumber: casual.phone,
                    userName,
                    passWord: hashedPassword,
                },
            });

            const chanceRoleHR = Math.random() < 0.2;
            const chanceInactive = Math.random() < 0.3;
            const chanceDelete = Math.random() < 0.1;

            if (chanceRoleHR) newUser.roleHumanResource();
            if (chanceInactive) newUser.statusInActive();
            else if (chanceDelete) newUser.statusDelete();

            return await userRepository.upsertUser({ user: newUser });
        }),
    );

    const allUsers = [...createdCustomUsers, ...createdRandomUsers];

    await Promise.all(
        allUsers.map(async (user) => {
            if (user.getId() === undefined) return;

            const userImage = UserImage.create({
                currentUser: user,
                userImageData: {
                    url: `https://api.dicebear.com/7.x/bottts/svg?seed=${user.getUserName()}&size=200`,
                    altText: `${user.getFirstName()} ${user.getLastName()}'s avatar`,
                    fileName: `${user.getUserName()}.svg`,
                    mimeType: 'image/svg+xml',
                    fileSize: 100,
                },
            });

            await userRepository.upsertUserImage({ userId: user.getId()!, userImage });
        }),
    );

    const validUsers = allUsers.filter((n): n is NonNullable<typeof n> => n !== undefined);
    const validCustoms = createdCustomUsers.filter(
        (n): n is NonNullable<typeof n> => n !== undefined,
    );
    const validRandoms = createdRandomUsers.filter(
        (n): n is NonNullable<typeof n> => n !== undefined,
    );

    return {
        allUsers: validUsers,
        customUsers: validCustoms,
        randomUsers: validRandoms,
    };
};
