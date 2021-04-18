/* Database methods related to the reviews subdocument
 ---------------------------------------------------------------------------*/
 const mongoCollections = require('../config/mongoCollections');
 const games = mongoCollections.games;
 let { ObjectId } = require('mongodb');
 const moment = require('moment'); // for date checking

 /**
  * Creates a review for a game in the database using the following parameters:
  * @param {string} reviewTitle 
  * @param {Object} author 
  * @param {string} reviewDate 
  * @param {string} review 
  * @param {number} rating 
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
    if (!(moment(datePublished, 'M/D/YYYY', true).isValid())) throw "The reviewDate must be of the format MM/DD/YYY";

    // review error checking
    if (!review) throw "A review must be provided";
    if (typeof review !== 'string') throw `${review || "provided argument"} must be a string`;
    if (review.trim().length === 0) throw "The review must not be an empty string";

    // rating error checking
    if (rating === null) throw "A rating must be provided";
    if (typeof rating !== 'number' || !Number.isInteger(rating)) throw `${review || "provided argument"} must be an integer.`;
    if (rating < 1 || rating > 5) throw "The rating must be an integer in the range [1-5]";

}