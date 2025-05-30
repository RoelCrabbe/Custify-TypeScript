import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import casual from 'casual';
import { Role } from '../../types';

const prisma = new PrismaClient();

const customUsers = [
    {
        firstName: 'Roel',
        lastName: 'Crabbé',
        userName: 'Roel_Crabbe',
        email: 'roel.crabbe@example.com',
        password: '@Roel_Crabbe123',
        role: Role.ADMIN,
    },
];

const main = async () => {
    // Step 1: Clean the database
    await prisma.user.deleteMany();
    console.log('Cleaned the database!');

    // Step 1: Add custom users to the database and get their IDs
    const createdCustomUsers = await Promise.all(
        customUsers.map(async (user) => {
            const passwordHash = await bcrypt.hash(user.password, 12);
            return prisma.user.create({
                data: {
                    userName: user.userName,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    passWord: passwordHash,
                    role: user.role,
                },
            });
        }),
    );

    // Step 2: Add custom users to the new random users to the database
    const users = [
        ...createdCustomUsers,
        ...(await Promise.all(
            Array.from({ length: 20 }).map(async () => {
                const firstName = casual.first_name;
                const lastName = casual.last_name;
                const username = firstName + '_' + lastName;
                const password = await bcrypt.hash('@' + username + '123', 12);
                const email = firstName.toLowerCase() + '.' + lastName.toLowerCase() + '@gmail.com';

                return prisma.user.create({
                    data: {
                        userName: username,
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        passWord: password,
                        role: Role.USER,
                    },
                });
            }),
        )),
    ];

    console.log('Database seeded successfully!');
};

(async () => {
    try {
        await main();
        await prisma.$disconnect();
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
})();
