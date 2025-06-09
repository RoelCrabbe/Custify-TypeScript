import database from '@config/prismaClient';
import { ErrorHttpMethod, ErrorSeverity, ErrorStatus, ErrorType } from '@error-log/enums';
import { ErrorLog } from '@error-log/model';
import { UserRole, UserStatus } from '@user/enums';
import { User } from '@user/model';
import bcrypt from 'bcryptjs';
import casual from 'casual';

// --- Step 1: Define Custom Users ---
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
];

// --- Step 2: Main Seeding Function ---
const main = async () => {
    // Clean the database
    await database.errorLog.deleteMany();
    await database.user.deleteMany();
    console.log('Cleaned the database!');

    // Seed custom users
    const createdCustomUsers = await Promise.all(
        customUsers.map(async (user) => {
            const hashedPassword = await bcrypt.hash(user.passWord, 12);
            const newUser = new User({ ...user, passWord: hashedPassword });

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

    // Seed random users
    const createdRandomUsers = await Promise.all(
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

            // Optional role/status randomization
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
                },
            });
        }),
    );

    const allUsers = [...createdCustomUsers, ...createdRandomUsers];

    // Seed error logs
    const errorTypes = Object.values(ErrorType);
    const errorSeverities = Object.values(ErrorSeverity);
    const httpMethods = Object.values(ErrorHttpMethod);
    const errorStatuses = Object.values(ErrorStatus);

    await Promise.all(
        Array.from({ length: 90 }).map(async () => {
            const randomUser = casual.random_element(allUsers);

            const errorData = {
                type: casual.random_element(errorTypes),
                severity: casual.random_element(errorSeverities),
                httpMethod: casual.random_element(httpMethods),
                errorMessage: casual.sentence,
                stackTrace: `Error at ${casual.url} on line ${casual.integer(10, 200)}`,
                requestPath: casual.url,
                status: casual.random_element(errorStatuses),
            };

            const newErrorLog = ErrorLog.create({
                currentUser: { getId: () => randomUser.id } as User,
                errorData,
            });

            await database.errorLog.create({
                data: {
                    type: newErrorLog.getType(),
                    severity: newErrorLog.getSeverity(),
                    httpMethod: newErrorLog.getHttpMethod(),
                    errorMessage: newErrorLog.getErrorMessage(),
                    stackTrace: newErrorLog.getStackTrace(),
                    requestPath: newErrorLog.getRequestPath(),
                    status: newErrorLog.getStatus(),
                    isArchived: false,
                    createdById: randomUser.id,
                    createdDate: new Date(),
                },
            });
        }),
    );

    console.log('Database seeded successfully!');
};

// --- Run the Seeder ---
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
