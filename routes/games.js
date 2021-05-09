/* Server routes related to games
 ---------------------------------------------------------------------------*/
const express = require('express');
const router = express.Router();
const data = require('../data');
const path = require('path');

const mongoCollections = require('../config/mongoCollections');
const { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } = require('constants');
const games = mongoCollections.games;
const gamesData = data.games;
const usersData = data.users;

// https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
const validURL = new RegExp('^(https?:\\/\\/)?'+ // protocol
'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
'(\\#[-a-z\\d_]*)?$','i'); // fragment locator

const validPrice = /^.+: \$\d+.\d\d$/; // price format

/**
 * Renders games list page.
 */
router.get('/', async (req, res) => {
    try {
        let gamesList = await gamesData.getAllGames();
        res.render('games/gameslist', { title: "Games", games: gamesList , gamesEmpty: gamesList.length === 0, signed_in: req.body.signed_in});
    } catch (e) {
        res.status(500).json({message: e});
    }
});

/**
 * Renders add new game page
 */
 router.get('/new', async (req, res) => {
    try {
        let gamesList = await gamesData.getAllGames();
        res.render('games/newgame', { title: "Add Game" , signed_in: req.body.signed_in});
    } catch (e) {
        res.status(500).json({message: e});
    }
});

/**
 * Renders single game page
 */
 router.get('/:id', async (req, res) => {
    let id = req.params.id;
    let errors = [];

    if (!id || id.trim().length === 0) {
        errors.push('Missing pid.');
    }

    if (errors.length > 0) {
        // console.log("error.");
        res.render('games/single', {
          errors: errors,
          hasErrors: true,
          title: "Error"
        });
        return;
    }

    try {
        let game = await gamesData.getGameById(id);
        res.render('games/single', { title: game.title, game: game, reviewEmpty: game.reviews.length === 0 , signed_in: req.body.signed_in});
    } catch (e) {
        res.status(404).json({message: e});
    }
});

/**
 * Adds a new game to the games collection.
 */
router.post('/new', async (req, res) => {
    let gameData = req.body;
    let errors = [];

    // title error checking
    if (!gameData.newTitle) {
        errors.push("A title must be provided");
    } else if (typeof gameData.newTitle !== 'string') {
        errors.push(`The title must be a string`);
    } else if (gameData.newTitle.trim().length === 0) {
        errors.push("The title must not be an empty string");
    }

    // image error checking
    if (!gameData.newImage) {
        errors.push("An image must be provided");
    } else if (typeof gameData.newImage !== 'string') {
        errors.push(`The image must be a string`);
    } else if (gameData.newImage.trim().length === 0) {
        errors.push("The image must not be an empty string");
    } else if (!validURL.test(gameData.newImage)) {
        errors.push("The image must be a valid url");
    }

    // publisher error checking
    if (!gameData.newPublisher) {
        errors.push("A publisher must be provided");
    } else if (typeof gameData.newPublisher !== 'string') {
        errors.push(`The publisher must be a string`);
    } else if (gameData.newPublisher.trim().length === 0) {
        errors.push("The publisher must not be an empty string");
    }

    // genres error checking
    let genresTrim = [];
    if (!gameData.newGenres) {
        errors.push("A genres array must be provided"); 
    } else if (!Array.isArray(gameData.newGenres)) {
        errors.push("The genres must be an array");
    } else if (gameData.newGenres.length === 0) {
        errors.push("The genres array must have at least one genre");
    } else {
        for (let x of gameData.newGenres) {
            if (x.trim().length === 0) {
                errors.push("The genres must not have an empty string");
                break;
            }
            genresTrim.push(x.trim());
        }
    }

    // releaseYear error checking
    const releaseYearParsed = parseInt(gameData.newReleaseYear);
    let d = new Date();
    if (!gameData.newReleaseYear) {
        errors.push("A release year must be provided");
    } else if (typeof gameData.newReleaseYear !== 'string') {
        errors.push("The release year must be a string");
    } else if (gameData.newReleaseYear.trim().length === 0) {
        errors.push("The release year must not be an empty string");
    } else if (gameData.newReleaseYear.trim().length !== 4) {
        errors.push("The release year must be a valid year");
    } else if (isNaN(releaseYearParsed)) {
        errors.push("The release year must be a valid year");
    } else if (releaseYearParsed < 1930 || releaseYearParsed > d.getFullYear() + 5) {
        errors.push("The release year must be a valid year");
    }

    // platforms error checking
    let platformsTrim = [];
    if (!gameData.newPlatforms) {
        errors.push("A platforms array must be provided"); 
    } else if (!Array.isArray(gameData.newPlatforms)) {
        errors.push("The platforms must be an array");
    } else if (gameData.newPlatforms.length === 0) {
        errors.push("The platform array must have at least one platform");
    } else {
        for (let x of gameData.newPlatforms) {
            if (x.trim().length === 0) {
                errors.push("The platforms must not have an empty string");
                break;
            }
            platformsTrim.push(x.trim());
        }
    }

    // prices error checking
    let pricesTrim = [];
    if (!gameData.newPrices) {
        errors.push("A prices array must be provided"); 
    } else if (!Array.isArray(gameData.newPrices)) {
        errors.push("The prices must be an array");
    } else if (gameData.newPrices.length === 0) {
        errors.push("The prices array must have at least one price");
    } else {
        for (let x of gameData.newPrices) {
            if (x.trim().length === 0) {
                errors.push("The prices must not have an empty string");
                break;
            } else if (typeof x !== 'string') {
                errors.push("The prices must be of the correct type. `Platform: $X.XX`");
                break;
            } else if (!validPrice.test(x.trim())) {
                errors.push("The prices must be of the correct form");
                break;
            }
            let obj = {};
            let values = x.split(" ");
            let platform = values[0];
            platform = platform.substring(0, platform.indexOf(":"));
            let price = values[1];
            obj.price = price;
            obj.platform = platform;
            pricesTrim.push(obj);
        }
    }

    // description error checking
    if (!gameData.newDesc) {
        errors.push("A description must be provided");
    } else if (typeof gameData.newDesc !== 'string') {
        errors.push(`The description must be a string`);
    } else if (gameData.newDesc.trim().length === 0) {
        errors.push("The description must not be an empty string");
    }

    if (errors.length > 0) { 
        res.status(400).render('games/newgame', { title: "Add Game", 
                                    gameTitle: gameData.newTitle.trim(),
                                    image: gameData.newImage.trim(),
                                    publisher: gameData.newPublisher.trim(),
                                    releaseYear: gameData.newReleaseYear.trim(),
                                    genre: genresTrim[0],
                                    platform: platformsTrim[0],
                                    price: gameData.newPrices[0].trim(),
                                    description: gameData.newDesc.trim(),
                                    error: errors});
        return;
    }

    try {
        const newGame = await gamesData.createGame(gameData.newTitle.trim(),
                                                gameData.newImage.trim(),
                                                gameData.newPublisher.trim(),
                                                genresTrim,
                                                gameData.newReleaseYear.trim(),
                                                platformsTrim,
                                                gameData.newDesc.trim(),
                                                pricesTrim);
        res.redirect(`/games/${newGame.title.trim()}`);
    } catch (e) {
        errors.push(e);
        res.status(500).render('games/newgame', { title: "Add Game", 
                gameTitle: gameData.newTitle.trim(),
                image: gameData.newImage.trim(),
                publisher: gameData.newPublisher.trim(),
                releaseYear: gameData.newReleaseYear.trim(),
                genre: genresTrim[0],
                platform: platformsTrim[0],
                price: gameData.newPrices[0].trim(),
                description: gameData.newDesc.trim(),
                error: errors, signed_in: req.body.signed_in});
        return;
    }

});

/**
 * Searches for games in the games collection.
 */
router.post('/search', async (req, res) => {
    let searchData = req.body;
    let errors = [];

    if (!searchData.searchTerm) {
        errors.push("No search term provided.");
    } else if (searchData.searchTerm.trim().length === 0) {
        errors.push("Search term must be non-empty.");
    }

    if (!searchData.searchType) { // should never happen but should still check
        errors.push("Search type not specified.");
    } else if (searchData.searchType.trim().length === 0) {
        errors.push("Search type must non-empty.");
    }

    // maybe update to make it so search type is remembered after search?
    let gamesList = await gamesData.getAllGames();
    if (errors.length > 0) { 
        res.render('games/gameslist', { title: "Games", 
                                        games: gamesList , 
                                        gamesEmpty: gamesList.length === 0, 
                                        error: errors, 
                                        search_type_value: searchData.searchType, 
                                        search_term_value: searchData.searchTerm , signed_in: req.body.signed_in});
        return;
    }
    
    // Change search depending on specified search type
    if (searchData.searchType === "title") {
        try {
            let searchList = await gamesData.searchGamesByTitle(searchData.searchTerm);
            res.render('games/gameslist', { title: "Games", 
                                            games: searchList , 
                                            gamesEmpty: searchList.length === 0,                                        
                                            search_type_value: searchData.searchType, 
                                            search_term_value: searchData.searchTerm, signed_in: req.body.signed_in });
        } catch (e) {
            res.render('games/gameslist', { title: "Games", 
                                            games: gamesList , 
                                            gamesEmpty: gamesList.length === 0, 
                                            error: e, 
                                            search_type_value: searchData.searchType, 
                                            search_term_value: searchData.searchTerm, signed_in: req.body.signed_in });
        }
    } else if (searchData.searchType === "genre") {
        try {
            let searchList = await gamesData.getGamesByGenre(searchData.searchTerm);
            res.render('games/gameslist', { title: "Games", 
                                            games: searchList, 
                                            gamesEmpty: searchList.length === 0,                                        
                                            search_type_value: searchData.searchType, 
                                            search_term_value: searchData.searchTerm, signed_in: req.body.signed_in });
        } catch (e) {
            res.render('games/gameslist', { title: "Games", 
                                            games: gamesList , 
                                            gamesEmpty: gamesList.length === 0, 
                                            error: e, 
                                            search_type_value: searchData.searchType, 
                                            search_term_value: searchData.searchTerm , signed_in: req.body.signed_in});
        }
    } else if (searchData.searchType === "platform") {
        try {
            let searchList = await gamesData.getGamesByPlatform(searchData.searchTerm);
            res.render('games/gameslist', { title: "Games", 
                                            games: searchList, 
                                            gamesEmpty: searchList.length === 0,                                        
                                            search_type_value: searchData.searchType, 
                                            search_term_value: searchData.searchTerm , signed_in: req.body.signed_in});
        } catch (e) {
            res.render('games/gameslist', { title: "Games", 
                                            games: gamesList , 
                                            gamesEmpty: gamesList.length === 0, 
                                            error: e, 
                                            search_type_value: searchData.searchType, 
                                            search_term_value: searchData.searchTerm , signed_in: req.body.signed_in});
        }
    } else if (searchData.searchType === "price") {
        try {
            let searchList = await gamesData.getGamesByPrice(searchData.searchTerm);
            res.render('games/gameslist', { title: "Games", 
                                            games: searchList, 
                                            gamesEmpty: searchList.length === 0,                                        
                                            search_type_value: searchData.searchType, 
                                            search_term_value: searchData.searchTerm , signed_in: req.body.signed_in});
        } catch (e) {
            res.render('games/gameslist', { title: "Games", 
                                            games: gamesList , 
                                            gamesEmpty: gamesList.length === 0, 
                                            error: e, 
                                            search_type_value: searchData.searchType, 
                                            search_term_value: searchData.searchTerm , signed_in: req.body.signed_in});
        }
    }
});

/**
 * Adds a game to a user's liked games, and increases the game's like count.
 */
 router.post('/like/:id', async (req, res) => {
    // Parse the game id
    let id = req.params.id;
    let errors = [];

    if (!id || id.trim().length === 0) {
        errors.push('Missing id.');
    }

    if (errors.length > 0) {
        // console.log("error.");
        res.status(404).json({message: e}); // CHANGE THIS
        return;
    }

    // Check if game exists with id
    try {
        let game = await gamesData.getGameById(id);
    } catch (e) {
        res.status(404).json({message: e}); // CHANGE THIS
    }

    // Make sure user is authenticated
    if (!req.session.user_id) {
        // User is not authenticated
        console.log("You must login to like a game."); // CHANGE THIS
        return res.redirect("/games");
    }

    // Check if game is already in the user's liked list
    // If it isn't, then add it and increment like count
    // If it's not, then remove it and decrement the like count
    let user;
	try {
		user = await usersData.getUserById(req.session.user_id);
	} catch (e) {
		return res.status(404).json({message: e});
	}
    let liked = false;
    for (let game of user.likes) {
		if (game._id.toString() == id) {
            liked = true;
		}
	}

    if (liked) { // Game is already liked; remove
        try {
            await usersData.removeLikedGame(req.session.user_id, id)
        } catch (e) {
            return res.status(500).json({message: e});
        }

        // Increment game's like count
        try {
            await gamesData.decrementLikes(id);
            return res.redirect("/games");
        } catch (e) {
            return res.status(500).json({message: e});
        }

    } else { // Game is not liked; add
        // Try to add the game to the user's liked list
        try {
            await usersData.addLikedGame(req.session.user_id, id)
        } catch (e) {
            return res.status(500).json({message: e});
        }

        // Increment game's like count
        try {
            await gamesData.incrementLikes(id);
            return res.redirect("/games");
        } catch (e) {
            return res.status(500).json({message: e});
        }
    }
    
});

module.exports = router;