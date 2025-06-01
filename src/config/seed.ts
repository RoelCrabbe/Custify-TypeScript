import database from '@config/prismaClient';
import { Role } from '@types';
import { User } from '@user/model';
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
        isActive: true,
        role: Role.ADMIN,
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
                    isActive: newUser.getIsActive(),
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
                userName,
                firstName,
                lastName,
                email,
                passWord: hashedPassword,
                phoneNumber: casual.phone,
            });

            if (Math.random() < 0.2) {
                newUser.deactivate();
            } else {
                newUser.activate();
            }

            return database.user.create({
                data: {
                    userName: newUser.getUserName(),
                    firstName: newUser.getFirstName(),
                    lastName: newUser.getLastName(),
                    email: newUser.getEmail(),
                    passWord: newUser.getPassWord(),
                    role: newUser.getRole(),
                    isActive: newUser.getIsActive(),
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
