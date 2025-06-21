import database from '@config/prismaClient';
import { createFakeErrorLogs } from '@errorLog/faker';
import { createFakeNotifications } from '@notification/faker';
import { createFakeUsers } from '@user/faker';

const main = async () => {
    const { allUsers, customUsers, randomUsers } = await createFakeUsers();
    await createFakeErrorLogs(customUsers, randomUsers);
    await createFakeNotifications(allUsers);
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
