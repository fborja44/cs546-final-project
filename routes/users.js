/* Server routes related to users
 ---------------------------------------------------------------------------*/
const express = require('express');
const router = express.Router();
const data = require('../data');
const path = require('path');

const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const usersData = data.users;

/**
 * 
 */
router.get('/', async (req, res) => {
    res.sendFile(path.resolve('static/home.html')); // temporary
});

/**
 * 
 */
router.post('/', async (req, res) => {
    
});

/**
 * Route to handle user login
 */
router.post('/login', async (req, res) => {
    
});

/**
 * Route to handle user logout
 */
router.get('/logout', async (req, res) => {
    
});

module.exports = router;