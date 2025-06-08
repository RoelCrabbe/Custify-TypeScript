import database from '@config/prismaClient';
import { User } from '@user/model';
import { Role } from '@user/role';
import { Status } from '@user/status';
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
        status: Status.Active,
        role: Role.Admin,
    },
];

const main = async () => {
    // Step 1: Clean the database
    await database.user.deleteMany();
    console.log('Cleaned the database!');

    // Step 2: Seed custom users
    const createdCustomUsers = await Promise.all(
        customUsers.map(async (user) => {
            const hashedPassword = await bcrypt.hash(user.passWord, 12);
            const newUser = new User({
                ...user,
                passWord: hashedPassword,
            });

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
                },
            });
        }),
    );

    // Step 3: Seed 20 random users
    const randomUsers = await Promise.all(
        Array.from({ length: 10 }).map(async () => {
            const firstName = casual.first_name;
            const lastName = casual.last_name;
            const userName = `${firstName}_${lastName}`;
            const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`;
            const plainPassword = `@${userName}123`;
            const hashedPassword = await bcrypt.hash(plainPassword, 12);

            const newUser = User.create({
                currentUser: null,
                userData: {
                    userName,
                    firstName,
                    lastName,
                    email,
                    passWord: hashedPassword,
                    phoneNumber: casual.phone,
                },
            });

            const chanceRoleHR = Math.random() < 0.2;
            const chanceInactive = Math.random() < 0.3;
            const chanceDelete = Math.random() < 0.1;

            if (chanceRoleHR) {
                newUser.roleHumanResource();
            }

            if (chanceInactive) {
                newUser.statusInActive();
            } else if (chanceDelete) {
                newUser.statusDelete();
            }

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
                },
            });
        }),
    );

    console.log('Database seeded successfully!');
};

(async () => {
    try {
        await main();
        await database.$disconnect();
    } catch (error) {
        console.error(error);
        await database.$disconnect();
        process.exit(1);
    }
})();
