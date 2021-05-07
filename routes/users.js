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
const usersData = data.users;

/**
 * 
 */
router.get('/', async (req, res) => {
    res.render('home', {}); // temporary
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
         res.render('home', { message: `Welcome ${newUser.username}`});
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
            res.render('home', { message: `Welcome ${userInfo.username}`});
        } else {
            res.status(401).render('users/login', { error: "Wrong password."});
        }
    // return to main page?
     } catch (e) {
        res.status(401).render('users/login', { title: "Login" });
     }
    // NOT DONE
});

/**
 * Route to handle user logout
 */
router.get('/logout', async (req, res) => {
    let userInfo = await usersData.getUserById(req.session.user_id);
    req.session.destroy();
    res.render('home', { message: `Bye ${userInfo.username}`});
});

module.exports = router;