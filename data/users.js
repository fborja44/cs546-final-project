/* Database methods related to users
 ---------------------------------------------------------------------------*/
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
let { ObjectId } = require('mongodb');

/**
 * Creates a user in the database using the following parameters:
 * @param {string} username A unique name that will be displayed across the site for the user.
 * @param {string} firstName The first name of the user.
 * @param {string} lastName The last name of the user.
 * @param {string} email The email of the user.
 * @param {string} hashedPassword The (hashed) password of the user used to log in.
 */
async function createUser(username, firstName, lastName, email) {

}

/**
 * Retrieves all users in the database.
 */
async function getAllUsers() {

}

/**
 * Retrieves a user in the databse with the given id.
 * @param {string} id String representation of the ObjectId of the user.
 */
async function getUserById(id) {

}

/**
 * Updates a user in the database with the given id.
 * @param {string} id String representation of the ObjectId of the user.
 */
async function updateUserById(id) {

}

/**
 * Deletes a user from the databse with the given id.
 * @param {string} id String representation of the ObjectId of the user.
 */
async function removeUserById(id) {

}

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUserById,
    removeUserById
};