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
    res.render('home', { main: "init" }); // temporary
    //res.sendFile(path.resolve('static/home.html')); // temporary
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
    res.render('users/signup', { title: "Sign Up" });
});

/**
 * Temporary post (for test)
 */
router.post('/signup', async (req, res) => {
    res.render('home', { main: "success" });
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

module.exports = router;