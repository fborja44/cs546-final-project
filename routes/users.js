/* Server routes related to users
 ---------------------------------------------------------------------------*/
const express = require('express');
const router = express.Router();
const data = require('../data');
const path = require('path');

const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const games = mongoCollections.games;
const usersData = data.users;
const gamesData = data.games;

/**
 * 
 */
router.get('/', async (req, res) => {
    try {
        let game = await gamesData.getBestGame();
        res.render('users/home', { title: "Home", game: game[0] });
    } catch (e) {
        res.status(404).json( {error: e });
    }
    
});

/**
 * 
 */
router.post('/', async (req, res) => {
    
});

/**
 * Route to login form
 */
 router.get('/login', async (req, res) => {
    res.render('users/login', { title: "Login" });
});

/**
 * Route to handle user login
 */
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    let error = false;
    
    // Check if username was entered
    if (!username) {
        res.status(401).render('users/login', { error: "Missing username." });
        return;
    }
    // Check if password was entered
    if (!password) {
        res.status(401).render('users/login', { error: "Missing password.", username: username });
        return;
    }

     // Retrieve user from file
     let user;
     try {
         user = await usersData.getUserByUsername(username); // Need to make this function
         req.session.user_id = user;

    // return to main page?
     } catch (e) {
    //     // User doesn't exist
    //     error = true;
        res.status(401).render('users/login', { title: "Login" });
    }
    // NOT DONE
});

/**
 * Route to handle user logout
 */
router.get('/logout', async (req, res) => {
    
});

/**
 * Route to individual user page. Should be public to all users.
 */
router.get('/users/:id', async (req, res) => {
    const id = req.params.id;
    let errors = [];

    if (!id) {
        // Display error page. error.handlebars
        res.status(404).render('general/error', { status: 404, error: "User ID missing." } );
    }

    try {
        const user = await usersData.getUserById(id);
        res.render('users/single', { title: user.username, user: user, reviewsEmpty: user.reviews.length === 0 });
    } catch (e) {
        res.status(404).render('general/error', { status: 404, error: "User not found." } );
    }
});

module.exports = router;