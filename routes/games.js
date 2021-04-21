/* Server routes related to games
 ---------------------------------------------------------------------------*/
const express = require('express');
const router = express.Router();
const data = require('../data');
const path = require('path');

const mongoCollections = require('../config/mongoCollections');
const games = mongoCollections.games;
const gamesData = data.games;

/**
 * Renders games list page.
 */
router.get('/', async (req, res) => {
    try {
        let gamesList = await gamesData.getAllGames();
        res.render('games/gameslist', { title: "Games", games: gamesList });
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
 * Adds a new game to the games collection.
 */
router.post('/new', async (req, res) => {
    
});

/**
 * Searches for games in the games collection.
 */
 router.post('/search', async (req, res) => {
    
});

module.exports = router;