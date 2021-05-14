/* Seed module to populate the database for testing.
 ---------------------------------------------------------------------------*/
const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const usersData = data.users;
const gamesData = data.games;
const reviewsData = data.reviews;
const replyData = data.replies;
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
        ["Adventure", "Fantasy", "Open World"],
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
        ["First-Person Shooter", "Team", "Tactical", "Shooting"],
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
        "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co1zhr.jpg",
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
        "https://specials-images.forbesimg.com/imageserve/5efac3590c5dac00077000c0/960x0.jpg",
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

    /* Game 7: Skyrim
    -----------------------------------------------------*/
    let game7 = await gamesData.createGame(
        "Skyrim",
        "https://upload.wikimedia.org/wikipedia/en/1/15/The_Elder_Scrolls_V_Skyrim_cover.png",
        "Bethesda",
        ["Adventure", "RPG", "Fantasy"],
        "2011",
        ["PC", "Xbox 360", "PlayStation 3", "Nintendo Switch", "Xbox One", "PlayStation 4"],
        "The Elder Scrolls V: Skyrim is an action role-playing game, playable from either a first or third-person perspective. The player may freely roam over the land of Skyrim which is an open world environment consisting of wilderness expanses, dungeons, caves, cities, towns, fortresses, and villages.",
        [{ price: "$29.99", platform: "PC" }]
    )
    let game7_id = game7._id.toString();

    /* Game 8: Hades
    -----------------------------------------------------*/
    let game8 = await gamesData.createGame(
        "Hades",
        "https://media.wired.com/photos/5f6cf5ec6f32a729dc0b3a89/master/w_1600%2Cc_limit/Culture_inline_Hades_PackArt.jpg",
        "Supergiant",
        ["Action", "Rogue-like", "Fantasy", "Indie"],
        "2020",
        ["PC", "Nintendo Switch"],
        "Hades is a rogue-like dungeon crawler in which you defy the god of the dead as you hack and slash your way out of the Underworld of Greek myth.",
        [{ price: "$24.99", platform: "PC" }]
    )
    let game8_id = game8._id.toString();

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

    let user2 = await usersData.createUser(
        "naomi",
        "Naomi",
        "Zheng",
        "nzheng1@stevens.edu",
        "password"
    )
    let user2_id = user2._id.toString();

    let user3 = await usersData.createUser(
        "brian",
        "Brian",
        "Lee",
        "elee9@stevens.edu",
        "password"
    )
    let user3_id = user3._id.toString();

    let user4 = await usersData.createUser(
        "bingxin",
        "Bingxin",
        "Xia",
        "bxia5@stevens.edu",
        "password"
    )
    let user4_id = user4._id.toString();

    let user5 = await usersData.createUser(
        "BestProfessor",
        "Patrick",
        "Hill",
        "phill@stevens.edu",
        "cs546spring"
    )
    let user5_id = user5._id.toString();

    /* Testing Users functions
    ---------------------------------------------------------------------------*/
    // Testing getAllUsers()
    //let users = await usersData.getAllUsers();
    // console.log(users);

    // Testing getUserById()
    //let usertest1 = await usersData.getUserById(user1_id);
    // console.log(usertest1);

    // Testing updateUserName()
    //await usersData.updateUsername(user1_id, "fborja");

    // Testing updateFirstName()
    //await usersData.updateFirstName(user1_id, "Frankie")

    // Testing updateLastName()
    //await usersData.updateLastName(user1_id, "B");

    /* Creating reviews
    ---------------------------------------------------------------------------*/
    /* Game 1 Reviews: Cyberpunk 2077
    -------------------------------------*/
    let review1_1 = await reviewsData.createReview(
        game1_id,
        "nice",
        { username: user1.username, _id: user1_id },
        "4/18/2020",
        "pretty cool",
        4
    )

    let review1_2 = await reviewsData.createReview(
        game1_id,
        "sucks",
        { username: user2.username, _id: user2_id },
        "4/15/2020",
        "this game sucks",
        1
    )

    let review1_3 = await reviewsData.createReview(
        game1_id,
        "ok i guess",
        { username: user3.username, _id: user3_id },
        "1/12/2021",
        "it was ok",
        3
    )

    /* Game 2 Reviews: Breath of the Wild
    -------------------------------------*/
    let review2_1 = await reviewsData.createReview(
        game2_id,
        "This Game is Awesome!",
        { username: user2.username, _id: user2_id },
        "4/18/2017",
        "This is the greatest game ever! Nintendo really outdid themselves",
        5
    )

    let review2_2 = await reviewsData.createReview(
        game2_id,
        "Could be better.",
        { username: user4.username, _id: user4_id },
        "6/23/2018",
        "It was an ok game I guess.",
        3
    )

    let review2_3 = await reviewsData.createReview(
        game2_id,
        "5 Stars",
        { username: user5.username, _id: user5_id },
        "6/23/2018",
        "^^^",
        5
    )

    let review2_4 = await reviewsData.createReview(
        game2_id,
        "lol",
        { username: user1.username, _id: user1_id },
        "2/15/2019",
        "this is a review",
        5
    )

    /* Game 3 Reviews: Valorant
    -------------------------------------*/
    let review3_1 = await reviewsData.createReview(
        game3_id,
        "this game is bad",
        { username: user3.username, _id: user3_id },
        "5/1/2021",
        "its not good",
        1
    )

    /* Game 4 Reviews: Emerald
    -------------------------------------*/
    let review4_1 = await reviewsData.createReview(
        game4_id,
        "title",
        { username: user1.username, _id: user1_id },
        "1/1/2000",
        "dope",
        4
    )

    
    /* Game 6 Reviews: NBA 2K20
    -----------------------------------------------------*/
    let review6_1 = await reviewsData.createReview(
        game6_id,
        "kd is a snake",
        { username: user4.username, _id: user4_id },
        "8/23/2020",
        "sssss",
        2
    )

    /* Game 8 Reviews: Hades
    -------------------------------------*/
    let review8_1 = await reviewsData.createReview(
        game8_id,
        "The Best Game Ever",
        { username: user2.username, _id: user2_id },
        "11/9/2020",
        "Supergiant always makes awesome games!",
        5
    )

    let review8_2 = await reviewsData.createReview(
        game8_id,
        "The Best Game Ever2",
        { username: user5.username, _id: user5_id },
        "11/9/2020",
        "Supergiant always makes awesome games!",
        4
    )

    let review8_3 = await reviewsData.createReview(
        game8_id,
        "The Best Game Ever3",
        { username: user1.username, _id: user1_id },
        "11/9/2020",
        "Supergiant always makes awesome games!",
        4
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
    // console.log(price1);

    // Testing getBestGameByGenre
    let bestgenre1 = await gamesData.getBestGameByGenre("Action");
    // console.log(bestgenre1);

     /* Testing Review functions
    ---------------------------------------------------------------------------*/
    //Testing Delete Review();
    //console.log("review Testing");
    //let r1 = await reviewsData.getReviewById(game2_id,review2_1._id);
    //console.log(r1);
    //let allReviewsBeforeDel = await reviewsData.getAllReviews(game2_id);
    //console.log(allReviewsBeforeDel);
    //let del1 = await reviewsData.deleteReview(game2_id,review2_1._id);
    //console.log(del1);
    //let allReviewsAfterDel = await reviewsData.getAllReviews(game2_id);
    // console.log(allReviewsAfterDel);
    //let updateReviews1 = await reviewsData.updateReview(game2_id,review2_1._id,"sdfd","","lololol",5);
    //console.log(updateReviews1);

    // Finished seeding
    console.log(chalk.yellow("\nDatabase seeding complete."));
    await db.serverConfig.close();
}

main().catch(console.log);
