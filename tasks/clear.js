/* Clear module to clear the database
 ---------------------------------------------------------------------------*/
const dbConnection = require('../config/mongoConnection');
const chalk = require('chalk'); // add colors to output for easier reading

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase(); // Drop the databse

    console.log(chalk.yellow("\nDatabase has successfully been cleared."));

    await db.serverConfig.close();
}

main().catch(console.log);