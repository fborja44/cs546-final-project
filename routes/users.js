/* Server routes related to users
 ---------------------------------------------------------------------------*/
const express = require('express');
const router = express.Router();
const data = require('../data');
const path = require('path');
const xss = require('xss');
const bcrypt = require('bcryptjs');

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
        return res.status(404).render('general/error', { status: 404, error: 'Something went wrong accessing the games database.' ,signed_in: req.body.signed_in, partial:"script"});
    }

    if (gamesList.length === 0) {
        res.render('users/home', { title: "Home", games: games, empty: true, signed_in: req.body.signed_in, partial:"home"});
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
        res.render('users/home', { title: "Home", games: games ,signed_in: req.body.signed_in, partial: 'home'});
    } catch (e) {
        res.status(500).render('general/error', { status: 500, error: 'Something went wrong with the server.' ,signed_in: req.body.signed_in, partial:'home'});
    }
    
});


router.get('/private/edit', async (req, res) => {
    if (!req.session.user_id){
        res.redirect('/login');
        return;
    }

    res.render('users/edit',  {title: "Edit", signed_in: req.body.signed_in, partial:"editUser"});
    return;
 
});


/**
 * 
 */
router.post('/private/edit', async (req, res) => {

    const firstName = xss(req.body.editfirstName).toString().trim();
    const lastName = xss(req.body.editlastName).toString().trim();
    const email = xss(req.body.editemail).toString().trim();
    const password = xss(req.body.editpassword).toString().trim();

    if(!firstName && !lastName && !email && !password){
        res.status(400).render('users/edit', { error: "Nothing will be changed, at least one field must be supplied.", signed_in: req.body.signed_in, partial:"editUser"});
        return;
    }
	 const emailPattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	 if (email && !emailPattern.test(email)){
        res.status(400).render('users/edit', { error: "Invaild email.", signed_in: req.body.signed_in, partial:"editUser"});
        return;
     }

     if (password && (password.length < 4 || password.length > 20)){
        res.status(400).render('users/edit', { error: "Password is too long or too short.", signed_in: req.body.signed_in, partial:"editUser"});
        return;
     }

     try{
         let userInfo = await usersData.getUserById(req.session.user_id);
         if(!userInfo){
            res.status(400).render('users/edit', { error: "User Not found.", signed_in: req.body.signed_in, partial:"editUser"});
            return;
         }
        
        if(firstName)
            await usersData.updateFirstName(userInfo._id, firstName);
        if(lastName)
            await usersData.updateLastName(userInfo._id, lastName);
        if(email)
            await usersData.updateEmail(userInfo._id, email);
        if(password)
            await usersData.updatePassword(userInfo._id, password);

         res.redirect('/private');
         return;
     } catch (e){
        res.status(404).render('users/edit', { error: 'User not found.', signed_in: req.body.signed_in, partial:"editUser"});
        return;
     }
});

/**
 * 
 */
router.get('/signup', async (req, res) => {
    res.render('users/signup', { title: "Sign up" ,signed_in: req.body.signed_in, partial:'signup'});
    return;
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
        res.status(400).render('users/signup', { error: "Error: Invalid input. All fields must be supplied.", signed_in: req.body.signed_in, partial:"signup"});
        return;
    }
	 const emailPattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	 if (!emailPattern.test(email)){
        res.status(400).render('general/error', { error: "Error: Invaild email.", signed_in: req.body.signed_in, partial:"signup"});
        return;
     }

     if (password.length < 4 || password.length > 20){
        res.status(400).render('general/error', { error: "Error: Password is too long or too short.", signed_in: req.body.signed_in, partial:"signup"});
        return;
     }

     try{
         let userInfo = await usersData.getUserByUsername(username);
         if(userInfo){
            res.status(400).render('users/signup', { error: "Error : Username already exists.", signed_in: req.body.signed_in, partial:"signup"});
            return;
         }
         let newUser = await usersData.createUser(username, firstName, lastName, email, password);
         let userId = newUser._id.toString();
         req.session.user_id = userId;
         res.redirect('/');
         return;
        //  res.render('users/home', { message: `Welcome ${newUser.username}`});
     } catch (e){
        res.status(400).render("general/error", {title: "Error", signed_in: req.body.signed_in, status:"404", partial:"gameList" });
     }

});

/**
 * Route to login form
 */
 router.get('/login', async (req, res) => {
    res.render('users/login', { title: "Login" ,signed_in: req.body.signed_in, partial:'signup'});
    return;
});

/**
 * Route to handle user login
 */
router.post('/login', async (req, res) => {

    const username = xss(req.body.username).toString().toLowerCase().trim();
    const password = xss(req.body.password).toString().trim();

    // Check both username and password
    if(!username || !password){
        res.status(401).render('users/login', { error: "Missing username or password.",username: username, signed_in: req.body.signed_in, partial:"signup"});
        return;
    }
    
     // Retrieve user from file
     try {
         let userInfo = await usersData.getUserByUsername(username); 

    // User doesn't exist
    if (!userInfo){
        res.status(401).render('users/login', { error: "Wrong username or password.",username: username,signed_in: req.body.signed_in, partial:"signup"});
        return;
    }
    
    if (await bcrypt.compare(password, userInfo.hashedPassword)){
        req.session.user_id = userInfo._id;
        res.redirect('/');
        return;
        // res.render('home', { message: `Welcome ${userInfo.username}`});
    } else {
        res.status(401).render('users/login', { error: "Wrong username or password.",username: username,signed_in: req.body.signed_in, partial:"signup"});
        return;
    }
    // return to main page?
     } catch (e) {
        res.status(401).render('users/login', { title: "Login" ,username:username,signed_in: req.body.signed_in, partial:"signup"});
        return;
     }
});

/**
 * Route to handle user logout
 */
router.get('/logout', async (req, res) => {
    if (!req.body.signed_in) {
        console.log('hello');
        res.redirect('/login');
        return;
    }
    let userInfo = await usersData.getUserById(req.session.user_id);
    req.session.destroy();
    let gamesList;
    try {
        gamesList = await gamesData.getAllGames();
    } catch (e) {
        // DISPLAY ERROR PAGE
        console.log('hello');
        return res.status(404).render('general/error', { status: "404", error: 'Something went wrong accessing the games database.' ,signed_in: req.body.signed_in, partial:"signup"});
    }
    res.redirect('/');
    return;
});

/**
 * Route to individual user page.
 */
router.get('/private', async (req, res) => {
    if (!req.session.user_id){
        res.redirect('/');
        return;
    }
    const id = req.session.user_id;
    const address = `/private/${id}`;
    res.redirect(address);
});

/**
 * Route to a user's private user page.
 */
router.get('/private/:id', async (req, res) => {
    if (!req.session.user_id || !req.params.id){
        res.redirect('/');
        return;
    }
    let id = req.params.id;
    const userId = req.session.user_id;
    if (id != userId)
        id = userId;

    if (!id) {
        // Display error page. error.handlebars
        res.status(404).render('general/error', { status: "404", error: "User ID missing." ,signed_in: req.body.signed_in} );
    }

    try {
        const user = await usersData.getUserById(id);
        res.render('users/private', {title: user.username, user: user, reviewsEmpty: user.reviews.length === 0, likesEmpty: user.likes.length === 0, followsEmpty: user.follows.length === 0, wishlistEmpty: user.wishlist.length === 0, signed_in: req.body.signed_in, partial:'signup'});
    } catch (e) {
        res.status(404).render('general/error', { status: "404", signed_in: req.body.signed_in, error: "User not found.", partial: "gameList"} );
    }
});

/**
 * Route to a user's public user page.
 */
router.get('/public/:id', async (req, res) => {
    let id = req.params.id;
    if (!id) {
        // Display error page. error.handlebars
        res.status(404).render('general/error', { status: 404, error: "User ID missing." ,signed_in: req.body.signed_in, partial:"gameList"} );
    }

    try {
        const user = await usersData.getUserById(id);
        res.render('users/single', {title: user.username, user: user, likesEmpty: user.likes.length === 0, followsEmpty: user.follows.length === 0, wishlistEmpty: user.wishlist.length === 0, reviewsEmpty: user.reviews.length === 0, signed_in: req.body.signed_in, partial:'signup'});
    } catch (e) {
        res.status(404).render("general/error", {title: "Error", signed_in: req.body.signed_in, status:"404", partial:"gameList" });
    }
});

module.exports = router;