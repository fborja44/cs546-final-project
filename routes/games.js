/* Server routes related to games
 ---------------------------------------------------------------------------*/
const express = require('express');
const router = express.Router();
const data = require('../data');

const mongoCollections = require('../config/mongoCollections');
const games = mongoCollections.games;
const gamesData = data.games;

/**
 * 
 */
router.get('/', async (req, res) => {
  
});

/**
 * 
 */
router.post('/', async (req, res) => {
    
});

module.exports = router;