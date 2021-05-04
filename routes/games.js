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

/**
 * Renders games list page.
 */
router.get('/', async (req, res) => {
    try {
        let gamesList = await gamesData.getAllGames();
        res.render('games/gameslist', { title: "Games", games: gamesList , gamesEmpty: gamesList.length === 0});
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
        res.render('games/newgame', { title: "Add Game" });
    } catch (e) {
        res.status(500).json({message: e});
    }
});

/**
 * Renders single game page
 */
 router.get('/:title', async (req, res) => {
    let title = req.params.title;
    let errors = [];

    if (!title || title.trim().length === 0) {
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
        let game = await gamesData.getGameByTitle(title);
        res.render('games/single', { title: game.title, game: game, reviewEmpty: game.reviews.length === 0 });
    } catch (e) {
        res.status(500).json({message: e});
    }
});

/**
 * Adds a new game to the games collection.
 */
router.post('/new', async (req, res) => {
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
        errors.push("Search term must non-empty.");
    }

    if (!searchData.searchType) { // should never happen but should still check
        errors.push("Search type not specified.");
    } else if (searchData.searchType.trim().length === 0) {
        errors.push("Search type must non-empty.");
    }

    if (errors.length > 0) {
        // show error on screen <--- REMEMBER TO ADD
        return;
    }
    
    // Change search depending on specified search type
    if (searchData.searchType === "title") {
        try {
            let searchList = await gamesData.searchGamesByTitle(searchData.searchTerm);
            res.render('games/gameslist', { title: "Games", games: searchList , gamesEmpty: searchList.length === 0});
        } catch (e) {
            res.json(e);
        }
    } else if (searchData.searchType === "genre") {
        try {
            let searchList = await gamesData.getGamesByGenre(searchData.searchTerm);
            res.render('games/gameslist', { title: "Games", games: searchList , gamesEmpty: searchList.length === 0});
        } catch (e) {
            res.json(e);
        }
    } else if (searchData.searchType === "platform") {
        try {
            let searchList = await gamesData.getGamesByPlatform(searchData.searchTerm);
            res.render('games/gameslist', { title: "Games", games: searchList , gamesEmpty: searchList.length === 0});
        } catch (e) {
            res.json(e);
        }
    } else if (searchData.searchType === "prices") {
        // implement
    }
});

module.exports = router;