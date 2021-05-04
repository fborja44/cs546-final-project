/* Seed module to populate the database for testing.
 ---------------------------------------------------------------------------*/
const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const usersData = data.users;
const gamesData = data.games;
const reviewsData = data.reviews;
const chalk = require('chalk'); // add colors to output for easier reading

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase(); // Drop the databse before initalizing data to avoid duplicate data.

    console.log(chalk.yellow("Seeding database..."));

    /* Creating games
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
        [{ price: "$49.99", platform: "PC" }, { price: "$49.99", platform: "Xbox One" }, { price: "$49.99", platform: "PlayStation 5" }]
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

    /* Game 3: Valorant
    -----------------------------------------------------*/
    let game3 = await gamesData.createGame(
        "Valorant",
        "https://cdn-ascope-prod.global.ssl.fastly.net/static/images/boxart_valorant_300x400.jpg",
        "Riot Games",
        ["First-Person Shooter", "Team", "Tactical"],
        "2020",
        ["PC"],
        "Valorant is a free-to-play hero shooter developed and published by Riot Games, for Microsoft Windows.",
        [{ price: "$0.00", platform: "PC" }]
    )
    let game3_id = game3._id.toString();

    /* Game 4: Pokemon Emerald
    -----------------------------------------------------*/
    let game4 = await gamesData.createGame(
        "Pokémon Emerald",
        "https://e.snmc.io/lk/f/x/a9134260c04804e3ae77eb4fb7760be7/5280480",
        "Gamefreak",
        ["Adventure", "RPG", "Strategy"],
        "2004",
        ["Game Boy Advance"],
        "Pokémon Emerald takes place over land and sea and pits you against the Team Aqua and Team Magma from Saphire and Ruby.",
        [{ price: "$20.00", platform: "Game Boy Advance" }]
    )
    let game4_id = game4._id.toString();

    /* Game 5: NBA 2K21
    -----------------------------------------------------*/
    let game5 = await gamesData.createGame(
        "NBA 2K21",
        "https://specials-images.forbesimg.com/imageserve/5efac3590c5dac00077000c0/960x0.jpg?fit=scale",
        "2K Games",
        ["Sports", "Simulation"],
        "2020",
        ["PlayStation 4", "Android", "PlayStation 5", "Xbox One", "PC", "Nintendo Switch"],
        "NBA 2K21 is a basketball simulation video game that was developed by Visual Concepts and published by 2K Sports, based on the National Basketball Association. It is the 22nd installment in the NBA 2K franchise and the successor to NBA 2K20.",
        [{ price: "$49.99", platform: "Xbox One" }]
    )
    let game5_id = game5._id.toString();

    /* Game 6: NBA 2K20
    -----------------------------------------------------*/
    let game6 = await gamesData.createGame(
        "NBA 2K20",
        "https://oyster.ignimgs.com/wordpress/stg.ign.com/2019/07/2KSMKT_NBA2K20_LE_AG_FOB.jpg",
        "2K Games",
        ["Sports", "Simulation"],
        "2019",
        ["PlayStation 4", "Android", "PlayStation 5", "Xbox One", "PC", "Nintendo Switch"],
        "NBA 2K20 is a basketball simulation video game developed by Visual Concepts and published by 2K Sports, based on the National Basketball Association. It is the 21st installment in the NBA 2K franchise, the successor to NBA 2K19, and the predecessor to NBA 2K21.",
        [{ price: "$49.99", platform: "Xbox One" }]
    )
    let game6_id = game6._id.toString();

    /* Creating reviews
    ---------------------------------------------------------------------------*/
    /* Game 1 Reviews: Cyberpunk 2077
    -------------------------------------*/
    let review1_1 = await reviewsData.createReview(
        game1_id,
        "nice",
        { username: "dude", _id: "1" },
        "4/18/2020",
        "pretty cool",
        4
    )

    let review1_2 = await reviewsData.createReview(
        game1_id,
        "sucks",
        { username: "otherdude", _id: "2" },
        "4/15/2020",
        "this game sucks",
        1
    )

    let review1_3 = await reviewsData.createReview(
        game1_id,
        "ok i guess",
        { username: "nextdude", _id: "3" },
        "1/12/2021",
        "it was ok",
        3
    )

    /* Game 2 Reviews: Breath of the Wild
    -------------------------------------*/
    let review2_1 = await reviewsData.createReview(
        game2_id,
        "This Game is Awesome!",
        { username: "ZeldaFan1000", _id: "4" },
        "4/18/2017",
        "This is the greatest game ever! Nintendo really outdid themselves",
        5
    )

    let review2_2 = await reviewsData.createReview(
        game2_id,
        "Could be better.",
        { username: "xXPessimistXx", _id: "5" },
        "6/23/2018",
        "It was an ok game I guess.",
        3
    )

    let review2_3 = await reviewsData.createReview(
        game2_id,
        "5 Stars",
        { username: "mang0", _id: "6" },
        "6/23/2018",
        "^^^",
        5
    )

    /* Testing Games functions
    ---------------------------------------------------------------------------*/
    // Testing getAllGames()
    let games = await gamesData.getAllGames();
    // console.log(games);

    // Testing getGameById()
    let test1 = await gamesData.getGameById(game1_id);
    // console.log(test1);

    // Testing getAllReviews()
    let reviews1 = await reviewsData.getAllReviews(game1_id);
    // console.log(reviews1);

    // Testing updateGameRating()
    // let update1 = await gamesData.updateGameRating(game1_id, 4.2);

    // Testing updateGameById()
    let update2 = await gamesData.updateGameById(game1_id,
        {
            prices: [{ price: "$49.99", platform: "PC" }, { price: "$49.99", platform: "Xbox One" }, { price: "$49.99", platform: "PlayStation 5" }]
        });

    // Testing removeGameById()
    let delete_this = await gamesData.createGame(
        "delete",
        "badurl.png",
        "no",
        ["hi"],
        "2001",
        ["samsung smart fridge"],
        "ok",
        [{ price: "$0.00", platform: "samsung smart fridge" }]
    )
    let delete1_id = delete_this._id;

    let delete1 = await gamesData.removeGameById(delete1_id);
    
    // Testing getGamesByRating
    let ratings1 = await gamesData.getGamesByRating(2);
    // console.log(ratings1);

    // Testing getGamesByGenre
    let genre1 = await gamesData.getGamesByGenre("action");
    // console.log(genre1);

    // Testing getGamesByPlatform
    let platform1 = await gamesData.getGamesByPlatform("pc");
    // console.log("platorm1");

    // Testing getBestGame
    let best1 = await gamesData.getBestGame();
    // console.log(best1);

    // Testing getGamesByPrice
    let price1 = await gamesData.getGamesByPrice("$30.00");
    console.log(price1);

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

    /* Testing Users functions
    ---------------------------------------------------------------------------*/
    // Testing getAllUsers()
    let users = await usersData.getAllUsers();
    // console.log(users);

    // Testing getUserById()
    let usertest1 = await usersData.getUserById(user1_id);
    // console.log(usertest1);

    // Testing updateUserName()
    //await usersData.updateUsername(user1_id, "fborja");

    // Testing updateFirstName()
    await usersData.updateFirstName(user1_id, "Frankie")

    // Testing updateLastName()
    await usersData.updateLastName(user1_id, "B");

    // Finished seeding
    console.log(chalk.yellow("\nDatabase seeding complete."));
    await db.serverConfig.close();
}

main().catch(console.log);