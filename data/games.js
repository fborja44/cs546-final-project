/* Database methods related to games
 ---------------------------------------------------------------------------*/
const mongoCollections = require('../config/mongoCollections');
const games = mongoCollections.games;
let { ObjectId } = require('mongodb');

/**
 * Creates a game in the database using the following parameters:
 * @param {string} title Title of the video game.
 * @param {string} image A url to an image to represent the game (cover art, promotional image, etc.)
 * @param {string} publisher Publisher of the video game.
 * @param {string[]} genres Array of strings representing the genres of the video game.
 * @param {string} releaseYear Year of release of the video game.
 * @param {string[]} platforms Array of strings representing the platforms of the video game.
 * @param {string} description Description of the video game.
 * @param {Object[]} prices An array of price subdocuments.
 */
async function createGame(title, image, publisher, genres, releaseYear, platforms, description, prices) {

}

/**
 * Retrieves all games in the database.
 */
async function getAllGames() {

}

/**
 * Retrieves a game in the databse with the given id.
 * @param {string} id String representation of the ObjectId of the game.
 */
async function getGameById(id) {

}

/**
 * Updates a game in the database with the given id.
 * @param {string} id String representation of the ObjectId of the game.
 */
async function updateGameById(id) {

}

/**
 * Deletes a game from the databse with the given id.
 * @param {string} id String representation of the ObjectId of the game.
 */
async function removeGameById(id) {

}

module.exports = {
    createGame,
    getAllGames,
    getGameById,
    updateGameById,
    removeGameById
};