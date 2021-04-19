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
    res.render('games/gameslist', {});
});

/**
 * 
 */
router.post('/', async (req, res) => {
    
});

module.exports = router;