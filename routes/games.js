/* Server routes related to games
 ---------------------------------------------------------------------------*/
const express = require('express');
const router = express.Router();
const data = require('../data');
const path = require('path');
const xss = require('xss');

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

function checkURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null); // https://stackoverflow.com/questions/9714525/javascript-image-url-verify
}

/**
 * Renders games list page.
 */
router.get('/', async (req, res) => {
    try {
        let gamesList = await gamesData.getAllGames();
        res.render('games/gameslist', { title: "Games", games: gamesList , gamesEmpty: gamesList.length === 0, signed_in: req.body.signed_in, partial:'gameList'});
    } catch (e) {
        res.status(500).render("general/error", {title: "Error", status:"500", error: e, signed_in: req.body.signed_in, partial: "gameList"});
    }
});

/**
 * Renders add new game page
 */
 router.get('/new', async (req, res) => {
    try {
        if (!req.session.user_id) {
            res.redirect('/login');
        } else {
            res.render('games/newgame', { title: "Add Game" , signed_in: req.body.signed_in, partial:'gameForm'});
        }
    } catch (e) {
        res.status(500).render("general/error", {title: "Error", status:"500", error: e, signed_in: req.body.signed_in, partial: "gameList"});
    }
});

/**
 * Renders single game page
 */
 router.get('/:id', async (req, res) => {
    let id = xss(req.params.id);
    let errors = [];

    if (!id || id.trim().length === 0) {
        errors.push('Missing id.');
    }

    if (errors.length > 0) {
        // console.log("error.");
        res.status(400).render('games/single', {
          errors: errors,
          hasErrors: true,
          title: "Error"
        });
        return;
    }

    try {
        let game = await gamesData.getGameById(id);
        res.render('games/single', { title: game.title, game: game, reviewEmpty: game.reviews.length === 0, user: req.session.user_id, signed_in: req.body.signed_in, partial:'gameList'});
    } catch (e) {
        res.status(404).render("general/error", {title: "Error", status:"404", error: e, signed_in: req.body.signed_in, partial: "gameList"});
    }
});

/**
 * Adds a new game to the games collection.
 */
router.post('/new', async (req, res) => {
    let gameData = {};
    gameData.newTitle = xss(req.body.newTitle);
    gameData.newImage = xss(req.body.newImage);
    gameData.newPublisher = xss(req.body.newPublisher);
    gameData.newGenres = [];
    gameData.newReleaseYear = xss(req.body.newReleaseYear);
    gameData.newPlatforms = [];
    gameData.newPrices = [];
    gameData.newDesc = xss(req.body.newDesc);
    for (let x of req.body.newGenres) {
        let strippedVal = xss(x);
        gameData.newGenres.push(strippedVal);
    }
    for (let x of req.body.newPlatforms) {
        let strippedVal = xss(x);
        gameData.newPlatforms.push(strippedVal);
    }
    for (let x of req.body.newPrices) {
        let strippedVal = xss(x);
        gameData.newPrices.push(strippedVal);
    }
    let errors = [];

    // title error checking
    if (!gameData.newTitle) {
        errors.push("A title must be provided");
    } else if (typeof gameData.newTitle !== 'string') {
        errors.push(`The title must be a string`);
    } else if (gameData.newTitle.trim().length === 0) {
        errors.push("The title must not be an empty string");
    } else if (gameData.newTitle.trim().length >= 50) {
        errors.push("The title must be within 50 characters");
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
    } else if (!checkURL(gameData.newImage)) {
        errors.push("The image must be a valid url");
    }

    // publisher error checking
    if (!gameData.newPublisher) {
        errors.push("A publisher must be provided");
    } else if (typeof gameData.newPublisher !== 'string') {
        errors.push(`The publisher must be a string`);
    } else if (gameData.newPublisher.trim().length === 0) {
        errors.push("The publisher must not be an empty string");
    } else if (gameData.newPublisher.trim().length >= 50) {
        errors.push("The publisher must be within 50 characters");
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
            } else if (x.trim().length >= 50) {
                errors.push("The genres must be within 50 characters");
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
            } else if (x.trim().length >= 50) {
                errors.push("The platforms must be within 50 characters");
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
                errors.push("The prices must be of the correct form. `Platform: $X.XX`");
                break;
            } else if (x.trim().length >= 50) {
                errors.push("The prices must be within 50 characters");
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
    } else if (gameData.newDesc.trim().length >= 1000) {
        errors.push("The description must be within 1000 characters");
    }

    if (errors.length > 0) { 
        res.status(400).render('games/newgame', { title: "Add Game", error: errors, signed_in: req.body.signed_in, partial:"gameForm"});
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
        res.redirect(`/games/${newGame._id}`);
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
                error: errors, 
                signed_in: req.body.signed_in, 
                partial:"gameForm"});
        return;
    }

});

/**
 * Searches for games in the games collection.
 */
router.post('/search', async (req, res) => {
    let searchTerm = xss(req.body.searchTerm);
    let searchType = xss(req.body.searchType);
    let errors = [];

    if (!searchTerm) {
        errors.push("No search term provided.");
    } else if (searchTerm.trim().length === 0) {
        errors.push("Search term must be non-empty.");
    }

    if (!searchType) { // should never happen but should still check
        errors.push("Search type not specified.");
    } else if (searchType.trim().length === 0) {
        errors.push("Search type must be non-empty.");
    }

    // maybe update to make it so search type is remembered after search?
    let gamesList = await gamesData.getAllGames();
    if (errors.length > 0) { 
        res.status(400).render('games/gameslist', { title: "Games", 
                                        games: gamesList , 
                                        gamesEmpty: gamesList.length === 0, 
                                        error: errors, 
                                        search_type_value: searchType, 
                                        search_term_value: searchTerm , 
                                        signed_in: req.body.signed_in, 
                                        partial:"gameList"});
        return;
    }
    
    // Change search depending on specified search type
    if (searchType === "title") {
        try {
            let searchList = await gamesData.searchGamesByTitle(searchTerm);
            res.render('games/gameslist', { title: "Games", 
                                            games: searchList , 
                                            gamesEmpty: searchList.length === 0,                                        
                                            search_type_value: searchType, 
                                            search_term_value: searchTerm, 
                                            title_selected: true,
                                            genre_selected: false,
                                            platform_selected: false,
                                            price_selected: false,
                                            signed_in: req.body.signed_in , 
                                            partial:"gameList"});
            return;
        } catch (e) {
            res.status(500).render('games/gameslist', { title: "Games", 
                                            games: gamesList , 
                                            gamesEmpty: gamesList.length === 0, 
                                            error: e, 
                                            search_type_value: searchType, 
                                            search_term_value: searchTerm, 
                                            title_selected: true,
                                            genre_selected: false,
                                            platform_selected: false,
                                            price_selected: false,
                                            signed_in: req.body.signed_in , 
                                            partial:"gameList"});
            return;
        }
    } else if (searchType === "genre") {
        try {
            let searchList = await gamesData.getGamesByGenre(searchTerm);
            res.render('games/gameslist', { title: "Games", 
                                            games: searchList, 
                                            gamesEmpty: searchList.length === 0,                                        
                                            search_type_value: searchType, 
                                            search_term_value: searchTerm, 
                                            title_selected: false,
                                            genre_selected: true,
                                            platform_selected: false,
                                            price_selected: false,
                                            signed_in: req.body.signed_in , 
                                            partial:"gameList"});
            return;
        } catch (e) {
            res.status(500).render('games/gameslist', { title: "Games", 
                                            games: gamesList , 
                                            gamesEmpty: gamesList.length === 0, 
                                            error: e, 
                                            search_type_value: searchType, 
                                            search_term_value: searchTerm , 
                                            title_selected: false,
                                            genre_selected: true,
                                            platform_selected: false,
                                            price_selected: false,
                                            signed_in: req.body.signed_in, 
                                            partial:"gameList"});
            return;
        }
    } else if (searchType === "platform") {
        try {
            let searchList = await gamesData.getGamesByPlatform(searchTerm);
            res.render('games/gameslist', { title: "Games", 
                                            games: searchList, 
                                            gamesEmpty: searchList.length === 0,                                        
                                            search_type_value: searchType, 
                                            search_term_value: searchTerm , 
                                            title_selected: false,
                                            genre_selected: false,
                                            platform_selected: true,
                                            price_selected: false,
                                            signed_in: req.body.signed_in, 
                                            partial:"gameList"});
            return;
        } catch (e) {
            res.status(500).render('games/gameslist', { title: "Games", 
                                            games: gamesList , 
                                            gamesEmpty: gamesList.length === 0, 
                                            error: e, 
                                            search_type_value: searchType, 
                                            search_term_value: searchTerm , 
                                            title_selected: flase,
                                            genre_selected: false,
                                            platform_selected: true,
                                            price_selected: false,
                                            signed_in: req.body.signed_in, 
                                            partial:"gameList"});
            return;
        }
    } else if (searchType === "price") {
        try {
            let searchList = await gamesData.getGamesByPrice(searchTerm);
            res.render('games/gameslist', { title: "Games", 
                                            games: searchList, 
                                            gamesEmpty: searchList.length === 0,                                        
                                            search_type_value: searchType, 
                                            search_term_value: searchTerm , 
                                            title_selected: false,
                                            genre_selected: false,
                                            platform_selected: false,
                                            price_selected: true,
                                            signed_in: req.body.signed_in, 
                                            partial:"gameList"});
            return;
        } catch (e) {
            res.status(500).render('games/gameslist', { title: "Games", 
                                            games: gamesList , 
                                            gamesEmpty: gamesList.length === 0, 
                                            error: e, 
                                            search_type_value: searchType, 
                                            search_term_value: searchTerm ,
                                            title_selected: false,
                                            genre_selected: false,
                                            platform_selected: false,
                                            price_selected: true,
                                            signed_in: req.body.signed_in, 
                                            partial:"gameList"});
            return;
        }
    }
});

/**
 * Adds a game to a user's liked games, and increases the game's like count.
 */
 router.post('/like/:id', async (req, res) => {
    // Parse the game id
    let id = xss(req.params.id);
    let single = xss(req.body.singleLike);
    let errors = [];

    if (!id || id.trim().length === 0) {
        errors.push('Missing id.');
    }

    if (errors.length > 0) {
        // console.log("error.");
        res.status(404).render("general/error", {title: "Error", signed_in: req.body.signed_in, status:"404", partial:"gameList" }); // CHANGE THIS
        return;
    }

    // Check if game exists with id
    try {
        let game = await gamesData.getGameById(id);
    } catch (e) {
        res.status(404).render("general/error", {title: "Error", signed_in: req.body.signed_in, status:"404", partial:"gameList" }); // CHANGE THIS
        return;
    }

    // Make sure user is authenticated
    if (!req.session.user_id) {
        // User is not authenticated
        console.log("You must login to like a game."); // CHANGE THIS
        return res.redirect("/login");
    }

    // Check if game is already in the user's liked list
    // If it isn't, then add it and increment like count
    // If it's not, then remove it and decrement the like count
    let user;
	try {
		user = await usersData.getUserById(req.session.user_id);
	} catch (e) {
		return res.status(404).render("general/error", {title: "Error", signed_in: req.body.signed_in, status:"404", partial:"gameList" });
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
            return res.status(500).render("general/error", {title: "Error", signed_in: req.body.signed_in, status:"500", partial:"gameList" });
        }

        // Decrement game's like count
        try {
            await gamesData.decrementLikes(id);
            if (single === 'single') {
                return res.redirect(`/games/${id.trim()}`);
            }
            return res.redirect(`/games/#${id.trim()}`);
        } catch (e) {
            return res.status(500).render("general/error", {title: "Error", signed_in: req.body.signed_in, status:"404", partial:"gameList" });
        }

    } else { // Game is not liked; add
        // Try to add the game to the user's liked list
        try {
            await usersData.addLikedGame(req.session.user_id, id)
        } catch (e) {
            return res.status(500).render("general/error", {title: "Error", signed_in: req.body.signed_in, status:"404", partial:"gameList" });
        }

        // Increment game's like count
        try {
            await gamesData.incrementLikes(id);
            if (single === 'single') {
                return res.redirect(`/games/${id.trim()}`);
            }
            return res.redirect(`/games/#${id.trim()}`);
        } catch (e) {
            return res.status(500).render("general/error", {title: "Error", signed_in: req.body.signed_in, status:"404", partial:"gameList" });
        }
    }
    
});

/**
 * Checks if a game is liked by the user
 * Responds with true if it is, false if not
 */
 router.get('/like/:id', async (req, res) => {
    // Parse the game id
    let id = xss(req.params.id);
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
        res.status(404).render("general/error", {title: "Error", signed_in: req.body.signed_in, status:"404", partial:"gameList" }); // CHANGE THIS
        return;
    }

    // Make sure user is authenticated
    if (!req.session.user_id) {
        // User is not authenticated
        return res.json({liked: false});
    }

    // Check if game is n the user's liked list
    let user;
	try {
		user = await usersData.getUserById(req.session.user_id);
	} catch (e) {
		return res.status(404).render("general/error", {title: "Error", signed_in: req.body.signed_in, status:"404", partial:"gameList" });
	}
    let liked = false;
    for (let game of user.likes) {
		if (game._id.toString() == id) {
            liked = true;
		}
	}
    return res.json({liked: liked});
});

router.post('/wishlist/:id', async (req, res) => {
    // Parse the game id
    let id = xss(req.params.id);
    let single = xss(req.body.singleWishlist);
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
        res.status(404).render("general/error", {title: "Error", signed_in: req.body.signed_in, status:"404", partial:"gameList" }); // CHANGE THIS
        return;
    }

    // Make sure user is authenticated
    if (!req.session.user_id) {
        // User is not authenticated
        console.log("You must login to wishlist a game."); // CHANGE THIS
        return res.redirect("/login");
    }

    // Check if game is already in the user's wishlist list
    // If it isn't, then add it and increment like count
    // If it's not, then remove it and decrement the like count
    let user;
	try {
		user = await usersData.getUserById(req.session.user_id);
	} catch (e) {
		return res.status(404).render("general/error", {title: "Error", signed_in: req.body.signed_in, status:"404", partial:"gameList" });
	}

    let wishlisted = false;
    for (let game of user.wishlist) {
		if (game._id.toString() == id) {
            wishlisted = true;
		}
	}

    // Game is not liked; add
    // Try to add the game to the user's liked list
    if (wishlisted) {
        try {
            await usersData.removeWishlistedGame(req.session.user_id, id)
            if (single === 'single') {
                return res.redirect(`/games/${id.trim()}`);
            }
            return res.redirect(`/games/#${id.trim()}`);
        } catch (e) {
            return res.status(500).render("general/error", {title: "Error", error: e, signed_in: req.body.signed_in, status:"500", partial:"gameList" });
        }
    } else {
        try {
            await usersData.addWishlistGame(req.session.user_id, id);
            if (single === 'single') {
                return res.redirect(`/games/${id.trim()}`);
            }
            return res.redirect(`/games/#${id.trim()}`);
        } catch (e) {
            return res.status(500).render("general/error", {title: "Error", error: e, signed_in: req.body.signed_in, status:"500", partial:"gameList" });
        }
    }
});

/**
 * Checks if a game is wishlisted by the user
 * Responds with true if it is, false if not
 */
 router.get('/wishlist/:id', async (req, res) => {
    // Parse the game id
    let id = xss(req.params.id);
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
        res.status(404).render("general/error", {title: "Error", signed_in: req.body.signed_in, status:"404", partial:"gameList" }); // CHANGE THIS
        return;
    }

    // Make sure user is authenticated
    if (!req.session.user_id) {
        // User is not authenticated
        return res.json({wishlisted: false});
    }

    // Check if game is n the user's wish list
    let user;
	try {
		user = await usersData.getUserById(req.session.user_id);
	} catch (e) {
		return res.status(404).render("general/error", {title: "Error", signed_in: req.body.signed_in, status:"404", partial:"gameList" });
	}
    let wishlisted = false;
    for (let game of user.wishlist) {
		if (game._id.toString() == id) {
            wishlisted = true;
		}
	}
    return res.json({wishlisted: wishlisted});
});

router.post('/follow/:id', async (req, res) => {
    // Parse the game id
    let id = xss(req.params.id);
    let single = xss(req.body.singleFollow);
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
        res.status(404).render("general/error", {title: "Error", signed_in: req.body.signed_in, status:"404", partial:"gameList" }); // CHANGE THIS
        return;
    }

    // Make sure user is authenticated
    if (!req.session.user_id) {
        // User is not authenticated
        console.log("You must login to follow a game."); // CHANGE THIS
        return res.redirect("/login");
    }

    // Check if game is already in the user's follow list
    // If it isn't, then add it and increment follow count
    // If it's not, then remove it and decrement the follow count
    let user;
	try {
		user = await usersData.getUserById(req.session.user_id);
	} catch (e) {
		return res.status(404).render("general/error", {title: "Error", signed_in: req.body.signed_in, status:"404", partial:"gameList" });
	}
    let follow = false;
    for (let game of user.follows) {
		if (game._id.toString() == id) {
            follow = true;
		}
	}

    if (follow) { // Game is already follows; remove
        try {
            await usersData.removeFollowGame(req.session.user_id, id)
        } catch (e) {
            return res.status(500).render("general/error", {title: "Error", signed_in: req.body.signed_in, status:"500", partial:"gameList" });
        }

        // Increment game's follow count
        try {
            await gamesData.decrementFollow(id);
            if (single === 'single') {
                return res.redirect(`/games/${id.trim()}`);
            }
            return res.redirect(`/games/#${id.trim()}`);
        } catch (e) {
            return res.status(500).render("general/error", {title: "Error", signed_in: req.body.signed_in, status:"500", partial:"gameList" });
        }

    } else { // Game is not followed; add
        // Try to add the game to the user's follows list
        try {
            await usersData.addFollowGame(req.session.user_id, id)
        } catch (e) {
            return res.status(500).render("general/error", {title: "Error", signed_in: req.body.signed_in, status:"500", partial:"gameList" });
        }

        // Increment game's follow count
        try {
            await gamesData.incrementFollow(id);
            if (single === 'single') {
                return res.redirect(`/games/${id.trim()}`);
            }
            return res.redirect(`/games/#${id.trim()}`);
        } catch (e) {
            return res.status(500).render("general/error", {title: "Error", signed_in: req.body.signed_in, status:"500", partial:"gameList" });
        }
    }
    
});

router.get('/follow/:id', async (req, res) => {
    // Parse the game id
    let id = xss(req.params.id);
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
        res.status(404).render("general/error", {title: "Error", signed_in: req.body.signed_in, status:"404", partial:"gameList" }); // CHANGE THIS
        return;
    }

    // Make sure user is authenticated
    if (!req.session.user_id) {
        // User is not authenticated
        return res.json({followed: false});
    }

    // Check if game is n the user's wish list
    let user;
	try {
		user = await usersData.getUserById(req.session.user_id);
	} catch (e) {
		return res.status(404).render("general/error", {title: "Error", signed_in: req.body.signed_in, status:"404", partial:"gameList" });
	}
    let followed = false;
    for (let game of user.follows) {
		if (game._id.toString() == id) {
            followed = true;
		}
	}
    return res.json({followed: followed});
});

module.exports = router;

