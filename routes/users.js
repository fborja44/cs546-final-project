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
    // Check to make sure that a game exist for the category before passing them to user/home
    // Need to render error pages
    let best_game, best_action, best_adventure, best_shooting, best_sports;
    let games = {};

    // Check if there are games in the collection
    let gamesList;
    try {
        gamesList = await gamesData.getAllGames();
    } catch (e) {

    }

    if (gamesList.length === 0) {
        res.render('users/home', { title: "Home", games: games, empty: true});
        return;
    }

    // Best Overall
    try {
        let best_game_ = await gamesData.getBestGame();
        best_game = best_game_[0];
        games.best_game = best_game;
    } catch (e) {
        // if it fails, then skip
    }

    // Best Action
    try {
        best_action = await gamesData.getBestGameByGenre("Action");
        games.best_action = best_action;
    } catch (e) {
        // if it fails, then skip
    }

    // Best Adventure
    try {
        best_adventure = await gamesData.getBestGameByGenre("Adventure");
        games.best_adventure = best_adventure;
    } catch (e) {

    }

    // Best Shooting
    try {
        best_shooting = await gamesData.getBestGameByGenre("Shooting");
        games.best_shooting = best_shooting;
    } catch (e) {

    }

    // Best Shooting
    try {
        best_sports = await gamesData.getBestGameByGenre("Sports");
        games.best_sports = best_sports;
    } catch (e) {

    }
    
    // Render the route
    try {
        res.render('users/home', { title: "Home", games: games });
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