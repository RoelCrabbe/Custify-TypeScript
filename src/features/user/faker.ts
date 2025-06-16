import database from '@config/prismaClient';
import { UserRole, UserStatus } from '@user/enums';
import { User } from '@user/user';
import bcrypt from 'bcryptjs';
import casual from 'casual';

const customUsers = [
    {
        firstName: 'Roel',
        lastName: 'Crabbé',
        userName: 'Roel_Crabbe',
        email: 'roel.crabbe@example.com',
        passWord: '@Roel_Crabbe123',
        phoneNumber: '0612345678',
        status: UserStatus.Active,
        role: UserRole.Admin,
    },
    {
        firstName: 'Daan',
        lastName: 'Crabbé',
        userName: 'Daan_Crabbe',
        email: 'daan.crabbe@example.com',
        passWord: '@Daan_Crabbe123',
        phoneNumber: '0612345678',
        status: UserStatus.Active,
        role: UserRole.Admin,
    },
];

export const createFakeUsers = async () => {
    await database.user.deleteMany();

    const createdCustomUsers = await Promise.all(
        customUsers.map(async (user) => {
            const hashedPassword = await bcrypt.hash(user.passWord, 12);

            const createdUser = User.create({
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

            createdUser.roleAdmin();

            return database.user.create({
                data: {
                    userName: createdUser.getUserName(),
                    firstName: createdUser.getFirstName(),
                    lastName: createdUser.getLastName(),
                    email: createdUser.getEmail(),
                    passWord: createdUser.getPassWord(),
                    role: createdUser.getRole(),
                    status: createdUser.getStatus(),
                    phoneNumber: createdUser.getPhoneNumber(),
                    createdById: createdUser.getCreatedById(),
                },
            });
        }),
    );

    const customUsersInstances = createdCustomUsers.map((userData) => User.from(userData));

    const createdRandomUsers = await Promise.all(
        Array.from({ length: 10 }).map(async () => {
            const firstName = casual.first_name;
            const lastName = casual.last_name;
            const userName = `${firstName}_${lastName}`;
            const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`;
            const plainPassword = `@${userName}123`;
            const hashedPassword = await bcrypt.hash(plainPassword, 12);

            const creatingUser = casual.random_element(customUsersInstances) as User;

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

            return database.user.create({
                data: {
                    userName: newUser.getUserName(),
                    firstName: newUser.getFirstName(),
                    lastName: newUser.getLastName(),
                    email: newUser.getEmail(),
                    passWord: newUser.getPassWord(),
                    role: newUser.getRole(),
                    status: newUser.getStatus(),
                    phoneNumber: newUser.getPhoneNumber(),
                    createdById: newUser.getCreatedById(),
                },
            });
        }),
    );

    const randomUsersInstances = createdRandomUsers.map((userData) => User.from(userData));

    return {
        allUsers: [...customUsersInstances, ...randomUsersInstances],
        customUsers: customUsersInstances,
        randomUsers: randomUsersInstances,
    };
};
