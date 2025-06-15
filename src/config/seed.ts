import database from '@config/prismaClient';
import { ErrorHttpMethod, ErrorLog, ErrorSeverity, ErrorStatus, ErrorType } from '@error-log';
import { User, UserRole, UserStatus } from '@user';
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

const generateStackTrace = (errorType: string, message: string): string => {
    const fileName = casual.random_element(['auth.js', 'user.js', 'app.js', 'index.js', 'db.js']);
    const modulePath = casual.random_element([
        'D:\\Projects\\Custify\\dist\\',
        'C:\\Users\\dev\\Repos\\api\\build\\',
        '/usr/src/app/dist/',
        '/app/server/build/',
    ]);

    const funcName = casual.random_element([
        'loginUser',
        'createAccount',
        'getUserData',
        'verifyToken',
        'fetchSession',
        'handleError',
    ]);

    const lines: string[] = [
        `${errorType}: ${message}`,
        `    at Object.${funcName} (${modulePath}${fileName}:${casual.integer(100, 999)}:${casual.integer(10, 80)})`,
        `    at async ${modulePath}${casual.random_element(['index.js', fileName])}:${casual.integer(10, 99)}:${casual.integer(10, 80)}`,
    ];

    return lines.join('\n');
};

const getRandomAdminId = (users: any[]): number | null => {
    const admins = users.filter(user => user.role === UserRole.Admin);
    if (admins.length === 0) return null;
    return casual.random_element(admins).id as number;
};

// --- Step 2: Main Seeding Function ---
const main = async () => {
    // Clean the database
    await database.errorLog.deleteMany();
    await database.user.deleteMany();
    console.log('Cleaned the database!');

    // Seed custom users
    const createdCustomUsers = await Promise.all(
        customUsers.map(async user => {
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
                requestPath: casual.url,
                status: casual.random_element(errorStatuses),
            };

            const stackTrace = generateStackTrace(errorData.type, errorData.errorMessage);

            const newErrorLog = ErrorLog.create({
                currentUser: { getId: () => randomUser.id } as User,
                errorData: { ...errorData, stackTrace },
            });

            const baseData: any = {
                type: newErrorLog.getType(),
                severity: newErrorLog.getSeverity(),
                httpMethod: newErrorLog.getHttpMethod(),
                errorMessage: newErrorLog.getErrorMessage(),
                stackTrace: newErrorLog.getStackTrace(),
                requestPath: newErrorLog.getRequestPath(),
                status: newErrorLog.getStatus(),
                createdById: randomUser.id,
            };

            if (newErrorLog.getStatus() === ErrorStatus.Resolved) {
                baseData.resolvedById = getRandomAdminId(allUsers);
                baseData.resolvedDate = new Date();
            }

            await database.errorLog.create({
                data: baseData,
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
