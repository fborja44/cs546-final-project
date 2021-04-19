/* Seed module to populate the database for testing.
 ---------------------------------------------------------------------------*/
const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const usersData = data.users;
const gamesData = data.games;
const chalk = require('chalk'); // add colors to output for easier reading

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase(); // Drop the databse before initalizing data to avoid duplicate data.

    /* Main seeding operations here
    ---------------------------------------------------------------------------*/
    /* Game 1: Cyberpunk 2077
    -------------------------------------*/
    let game1 = await gamesData.createGame(
        "Cyberpunk 2077",
        "https://s1.gaming-cdn.com/images/products/840/orig/cyberpunk-2077-cover.jpg",
        "CD Projekt Red",
        ["Shooting", "Adventure", "Action", "RPG"],
        "2020",
        ["PlayStation 4", "Google Stadia", "Xbox One", "PlayStation 5", "Xbox Series X", "PC"],
        "Cyberpunk 2077 is a 2020 action role-playing video game developed and published by CD Projekt. The story takes place in Night City, an open world set in the Cyberpunk universe.",
        [{ price: "$49.99", platform: "PC" }]
    )
    let game1_id = game1._id.toString();

    /* Game 2: The Legend of Zelda: Breath of the Wild
    -----------------------------------------------------*/
    let game2 = await gamesData.createGame(
        "The Legend of Zelda: Breath of the Wild",
        "https://upload.wikimedia.org/wikipedia/en/c/c6/The_Legend_of_Zelda_Breath_of_the_Wild.jpg",
        "Nintendo",
        ["Adventure", "Action", "Fantasy", "Open World"],
        "2017",
        ["Nintendo Switch", "Wii U"],
        "Breath of the Wild is part of the Legend of Zelda franchise and is set at the end of the Zelda timeline; the player controls Link, who awakens from a hundred-year slumber to defeat Calamity Ganon and save the kingdom of Hyrule.",
        [{ price: "$49.99", platform: "Nintendo Switch" }]
    )
    let game2_id = game2._id.toString();
    
    // Testing getAllGames()
    let games = await gamesData.getAllGames();
    console.log(games);

    // Testing getGameById()
    let test1 = await gamesData.getGameById(game1_id);
    console.log(test1);

    /* Creating Users
    ---------------------------------------------------------------------------*/
    let user1 = await usersData.createUser(
        "fborja44",
        "Francis",
        "Borja",
        "fborja@stevens.edu",
        "supersecret"
    )
    let user1_id = user1._id.toString();

    // Testing getAllUsers()
    let users = await usersData.getAllUsers();
    console.log(users);

    // Testing getUserById()
    let usertest1 = await usersData.getUserById(user1_id);
    console.log(usertest1);

    // Testing updateUserName()
    await usersData.updateUsername(user1_id, "fborja");

    // Testing updateFirstName()
    await usersData.updateFirstName(user1_id, "Frankie")

    // Testing updateLastName()
    await usersData.updateLastName(user1_id, "B");


    // Finished seeding
    console.log(chalk.yellow("\nDatabase seeding complete."));
    await db.serverConfig.close();
}

main().catch(console.log);