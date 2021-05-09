/* Server routes related to users
 ---------------------------------------------------------------------------*/
const express = require('express');
const router = express.Router();
const data = require('../data');
const path = require('path');
const xss = require('xss');
const bcrypt = require('bcrypt');



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

    let default_game = {
        title: " ",
        image: "../public/img/default_game.png",
        averageRating: "N/A"
    };

    // Check if there are games in the collection
    let gamesList;
    try {
        gamesList = await gamesData.getAllGames();
    } catch (e) {
        // DISPLAY ERROR PAGE
        return res.status(404).render('general/error', { status: 404, error: 'Something went wrong accessing the games database.' });
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
        // if it fails, then make a default game
        games.best_game = default_game;
    }

    // Best Action
    try {
        best_action = await gamesData.getBestGameByGenre("Action");
        games.best_action = best_action;
    } catch (e) {
        games.best_action = default_game;
    }

    // Best Adventure
    try {
        best_adventure = await gamesData.getBestGameByGenre("Adventure");
        games.best_adventure = best_adventure;
    } catch (e) {
        games.best_adventure = default_game;
    }

    // Best Shooting
    try {
        best_shooting = await gamesData.getBestGameByGenre("Shooting");
        if (best_shooting != null) {
            games.best_shooting = best_shooting;
        } else {
            games.best_shooting = default_game;
        }
        
    } catch (e) {
        games.best_shooting = default_game;
    }

    // Best Shooting
    try {
        best_sports = await gamesData.getBestGameByGenre("Sports");
        games.best_sports = best_sports;
    } catch (e) {
        games.best_sports = default_game;
    }
    
    // Render the route
    try {
        res.render('users/home', { title: "Home", games: games});
    } catch (e) {
        res.status(404).render('general/error', { status: 500, error: 'Something went wrong with the server.' });
    }
    
});

/**
 * 
 */
router.post('/', async (req, res) => {
    
});

/**
 * 
 */
router.get('/signup', async (req, res) => {
    res.render('users/signup', { title: "Sign up" });
});

/**
 * Temporary post (for test)
 */
router.post('/signup', async (req, res) => {
    const username = xss(req.body.signup_username).toString().toLowerCase().trim();
    const firstName = xss(req.body.firstName).toString().trim();
    const lastName = xss(req.body.lastName).toString().trim();
    const email = xss(req.body.signup_email).toString().trim();
    const password = xss(req.body.signup_password).toString().trim();

    if(!username || !firstName || !lastName || !email || !password){
        res.status(400).render('users/signup', { error: "Error 400: Invalid inputs to sign up, all feilds must be supplied."});
        return;
    }
	 const emailPattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	 if (!emailPattern.test(email)){
        res.status(400).render('general/error', { error: "Error 400: Invaild email."});
        return;
     }

     try{
         let userInfo = await usersData.getUserByUsername(username);
         if(userInfo){
            res.status(400).render('users/signup', { error: "Error : Username exists."});
            return;
         }
         let newUser = await usersData.createUser(username, firstName, lastName, email, password);
         let userId = newUser._id.toString();
         req.session.user_id = userId;
         res.redirect('/');
        //  res.render('users/home', { message: `Welcome ${newUser.username}`});
     } catch (e){
        res.status(400).json({ error: 'Creation failed.'});
     }

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

    const username = xss(req.body.username).toString().toLowerCase().trim();
    const password = xss(req.body.password).toString().trim();

    // Check both username and password
    if(!username || !password){
        res.status(401).render('users/login', { error: "Missing username or password."});
        return;
    }
    
     // Retrieve user from file
     try {
         let userInfo = await usersData.getUserByUsername(username); 

    // User doesn't exist
        if (!userInfo){
            res.status(401).render('users/login', { error: "User doesn't exist."});
            return;
        }
        
        if (await bcrypt.compare(password, userInfo.hashedPassword)){
            req.session.user_id = userInfo._id;
            res.redirect('/');
            // res.render('home', { message: `Welcome ${userInfo.username}`});
        } else {
            res.status(401).render('users/login', { error: "Wrong password."});
        }
    // return to main page?
     } catch (e) {
        return res.status(404).render('general/error', { status: 404, error: 'Something went wrong.' });
     }
});

/**
 * Route to handle user logout
 */
router.get('/logout', async (req, res) => {
    let userInfo = await usersData.getUserById(req.session.user_id);
    req.session.destroy();
    let gamesList;
    try {
        gamesList = await gamesData.getAllGames();
    } catch (e) {
        // DISPLAY ERROR PAGE
        return res.status(404).render('general/error', { status: 404, error: 'Something went wrong accessing the games database.' });
    }
    res.redirect('/');
});

/**
 * Route to individual user page.
 */
router.get('/users', async (req, res) => {
    if (!req.session.user_id){
        res.redirect('/');
        return;
    }
    const id = req.session.user_id;
    const address = `/users/${id}`;
    res.redirect(address);
});




/**
 * Route to individual user page. Should be public to all users.
 */
router.get('/users/:id', async (req, res) => {
    if (!req.session.user_id || !req.params.id){
        res.redirect('/');
        return;
    }
    let id = req.params.id;
    const userId = req.session.user_id;
    if (id != userId)
        id = userId;
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