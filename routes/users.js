/* Server routes related to users
 ---------------------------------------------------------------------------*/
const express = require('express');
const router = express.Router();
const data = require('../data');

const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const usersData = data.users;

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