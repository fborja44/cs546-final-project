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
 * 
 */
router.post('/', async (req, res) => {
    
});

module.exports = router;