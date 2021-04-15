/* Seed module to populate the database for testing.
 ---------------------------------------------------------------------------*/
const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const usersData = data.users;
const gamesData = data.games;

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase(); // Drop the databse before initalizing data to avoid duplicate data.

    // Finished seeding
    console.log("\nDatabase seeding complete.");
    await db.serverConfig.close();
}

main().catch(console.log);