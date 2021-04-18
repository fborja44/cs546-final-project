/* Database methods related to the reviews subdocument
 ---------------------------------------------------------------------------*/
 const mongoCollections = require('../config/mongoCollections');
 const games = mongoCollections.games;
 let { ObjectId } = require('mongodb');
 const moment = require('moment'); // for date checking
 const gamesData = require('./games'); // games database methods

 /**
  * Creates a review for a game in the database using the following parameters:
  * @param {string} gameId The Id of the game being reviewed.
  * @param {string} reviewTitle The title of the review.
  * @param {Object} author Object containing the user's id and username.
  * @param {string} reviewDate The date of the published review, in the format MM/DD/YYYY.
  * @param {string} review The main content of the review.
  * @param {number} rating The rating of the review (Integer between 1 and 5 inclusive).
  */
 async function createReview(gameId, reviewTitle, author, reviewDate, review, rating) {
    // gameId error checking
    if (!gameId) throw "A title must be provided";
    if (typeof gameId !== 'string') throw `${gameId || "provided argument"} must be a string`;
    if (gameId.trim().length === 0) throw "The gameId must not be an empty string";

    // reviewTitle error checking
    if (!reviewTitle) throw "A reviewTitle must be provided";
    if (typeof reviewTitle !== 'string') throw `${reviewTitle || "provided argument"} must be a string`;
    if (reviewTitle.trim().length === 0) throw "The reviewTitle must not be an empty string";

    // author error checking
    if (!author) throw "An author must be provided";
    if (typeof author !== 'object') throw `${author || "provided argument"} must be a string`;
    // author username
    if (!author.username) throw "Author's username must be provided";
    if (typeof author.username !== 'string') throw `${author.username || "provided argument"} must be a string`;
    if (author.username.trim().length === 0) throw "Author's username must not be an empty string";
    // author id
    if (!author._id) throw "Author's id must be provided";
    if (typeof author._id !== 'string') throw `${author.username || "provided argument"} must be a string`;
    if (author._id.trim().length === 0) throw "Author's id must not be an empty string";
    
    // reviewDate error checking
    if (!reviewDate) throw "The reviewDate must be provided";
    if (typeof reviewDate !== 'string') throw `${reviewDate || "provided argument"} must be a string`;
    if (reviewDate.trim().length === 0) throw "The reviewDate must not be an empty string";
    if (!(moment(reviewDate, 'M/D/YYYY', true).isValid())) throw "The reviewDate must be of the format MM/DD/YYY";

    // review error checking
    if (!review) throw "A review must be provided";
    if (typeof review !== 'string') throw `${review || "provided argument"} must be a string`;
    if (review.trim().length === 0) throw "The review must not be an empty string";

    // rating error checking
    if (rating === null) throw "A rating must be provided";
    if (typeof rating !== 'number' || !Number.isInteger(rating)) throw `${review || "provided argument"} must be an integer.`;
    if (rating < 1 || rating > 5) throw "The rating must be an integer in the range [1-5]";

    const gameCollection = await games();

    let newReview = {
        _id: ObjectId(),
        reviewTitle: reviewTitle.trim(),
        author: {
            username: author.username.trim(),
            _id: author._id.trim()
        },
        reviewDate: reviewDate,
        review: review.trim(),
        replies: [],
        rating: rating
    }

    gameId = ObjectId(gameId);
    const updateInfo = await gameCollection.updateOne(
        { _id: gameId },
        { $addToSet: { reviews: newReview } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Failed to create review.';
    newReview._id = newReview._id.toString();
    return newReview;
}

/**
 * Returns all of the reviews for the game with the given id.
 * @param {string} gameId 
 */
async function getAllReviews(gameId) {
    // gameId error checking
    if (!gameId) throw "A title must be provided";
    if (typeof gameId !== 'string') throw `${gameId || "provided argument"} must be a string`;
    if (gameId.trim().length === 0) throw "The gameId must not be an empty string";

    const game = await gamesData.getGameById(gameId);
    return game.reviews;
}

module.exports = {
    createReview,
    getAllReviews
}