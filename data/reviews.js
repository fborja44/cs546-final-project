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
    parsedGameId = ObjectId(gameId);

    const updateInfo = await gameCollection.updateOne(
        { _id: parsedGameId },
        { $addToSet: { reviews: newReview } },
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Failed to create review.';
    newReview._id = newReview._id.toString();

    // Also remember to update the game's average rating!
    let total = 0, avgRating;
    let game = await gamesData.getGameById(gameId);
    for (let i = 0; i < game.reviews.length; i++) {
        let review = game.reviews[i];
        total += review.rating;
    }
    avgRating = total/game.reviews.length;
    // trim to 1 decimal
    avgRating = parseFloat(avgRating.toFixed(1));
    await gamesData.updateGameRating(gameId, avgRating);

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

/**
 *Gets a Review by id given a game id
 * @param {string} gameId
 * @param {string} reviewId
 */
async function getReviewById(gameId,reviewId){
    if (!gameId) throw "A gameId must be provided";
    if (typeof gameId !== 'string') throw `${gameId || "provided argument"} must be a string`;
    if (gameId.trim().length === 0) throw "The gameId must not be an empty string";


    if (!reviewId) throw "A reviewId must be provided";
    if (typeof reviewId !== 'string') throw `${reviewId || "provided argument"} must be a string`;
    if (reviewId.trim().length === 0) throw "The reviewId must not be an empty string";

    const game = await gamesData.getGameById(gameId);
    for(let i=0; i<game.reviews.length;i++){
        if(game.reviews[i]._id == reviewId){
            return game.reviews[i];
        }
    }
    throw "no review with that id";
}

/**
 * Searches for and returns a review in the database through all of the games
 * @param {string} gameId
 * @param {string} reviewId
 */
 async function getReview(reviewId){
    if (!reviewId) throw "A reviewId must be provided";
    if (typeof reviewId !== 'string') throw `${reviewId || "provided argument"} must be a string`;
    if (reviewId.trim().length === 0) throw "The reviewId must not be an empty string";

    const gamesList = await gamesData.getAllGames();
    for (const game of gamesList) {
        for (let i = 0; i < game.reviews.length; i++){
            if (game.reviews[i]._id == reviewId){
                return game.reviews[i];
            }
        }
    }
    throw "no review with that id";
}

/**
 * Updates a review
 * @param {string} gameId
 * @param {string} reviewTitle
 * @param {string} reviewDate
 * @param {number} rating
 * @param {string} reviewId
 */
async function updateReview(gameId,reviewId, reviewTitle, reviewDate, review, rating){

    // gameId error checking
    if (!gameId) throw "A gameId must be provided";
    if (typeof gameId !== 'string') throw `${gameId || "gameId provided argument"} must be a string`;
    if (gameId.trim().length === 0) throw "The gameId must not be an empty string";

    // reviewId error checking
    if (!reviewId) throw "A reviewId must be provided";
    if (typeof reviewId !== 'string') throw `${reviewId || "reviewId provided argument"} must be a string`;
    if (reviewId.trim().length === 0) throw "The gameId must not be an empty string";


    let specificReview = await getReviewById(gameId,reviewId);

    // reviewTitle error checking
    if(reviewTitle || reviewTitle.trim().length ===0){
    if (typeof reviewTitle !== 'string') throw `${reviewTitle || "reviewTitle provided argument"} must be a string`;
    if (reviewTitle.trim().length === 0) throw "The reviewTitle must not be an empty string";
        specificReview.reviewTitle = reviewTitle
    }

    // author error checking
    //if (!author) author_ = games.author;
    // else:
    //     if (typeof author !== 'object') throw `${author || "provided argument"} must be a string`;
        // author username
        // if (!author.username) throw "Author's username must be provided";
        // if (typeof author.username !== 'string') throw `${author.username || "provided argument"} must be a string`;
        // if (author.username.trim().length === 0) throw "Author's username must not be an empty string";
        // // author id
        // if (!author._id) throw "Author's id must be provided";
        // if (typeof author._id !== 'string') throw `${author.username || "provided argument"} must be a string`;
        // if (author._id.trim().length === 0) throw "Author's id must not be an empty string";


    // reviewDate error checking
    if (reviewDate || reviewDate.trim().length ===0) {
        if (typeof reviewDate !== 'string') throw `${reviewDate || "reviewDate provided argument"} must be a string`;
        if (reviewDate.trim().length === 0) throw "The reviewDate must not be an empty string";
        if (!(moment(reviewDate, 'M/D/YYYY', true).isValid())) throw "The reviewDate must be of the format MM/DD/YYY";
        specificReview.reviewDate = reviewDate;
    }

    // review error checking
    if (review  || review.trim().length ===0) {
        if (typeof reviewDate !== 'string') throw `${reviewDate || "review provided argument"} must be a string`;
        if (reviewDate.trim().length === 0) throw "The reviewDate must not be an empty string";
        if (!(moment(reviewDate, 'M/D/YYYY', true).isValid())) throw "The reviewDate must be of the format MM/DD/YYY";
        specificReview.reviewDate = reviewDate;
    }

    // review error checking
    if (review || review.trim().length ===0){
        if (typeof review !== 'string') throw `${review || "review provided argument"} must be a string`;
        if (review.trim().length === 0) throw "The review must not be an empty string";
        specificReview.review=review;
    }

    // rating error checking
    if (rating || rating.trim().length ===0){
        if (typeof rating !== 'number' || !Number.isInteger(rating)) throw `${rating || "rating provided argument"} must be an integer.`;
        if (rating < 1 || rating > 5) throw "The rating must be an integer in the range [1-5]"
        specificReview.rating = rating;
    }



    const gamesCollection = await games();
    let parsedGameId = ObjectId(gameId);
    let parseReviewId = ObjectId(reviewId);
    const updatedInfo = await gamesCollection.updateOne({_id:parsedGameId,
                                               "reviews._id":parseReviewId},
                                              {$set:{"reviews.$":specificReview}});
    if(updatedInfo.modifiedCount === 0) throw "Could not update reviews successfully."
  
    return await getReviewById(gameId,reviewId);

}

/**
 * Deletes a review
 * @param {string} gameId
 * @param {string} reviewId
 *
 */
async function deleteReview(gameId,reviewId){
    // gameId error checking
    if (!gameId) throw "A gameId must be provided";
    if (typeof gameId !== 'string') throw `${gameId || "provided argument"} must be a string`;
    if (gameId.trim().length === 0) throw "The gameId must not be an empty string";


    // reviewId error checking
    if (!reviewId) throw "A reviewId must be provided";
    if (typeof reviewId !== 'string') throw `${reviewId || "provided argument"} must be a string`;
    if (reviewId.trim().length === 0) throw "The gameId must not be an empty string";

    let parseGameId = ObjectId(gameId);
    let parseReviewId = ObjectId(reviewId);
   
    const gamesCollection = await games();
  
    const updatedGameReview = gamesCollection.updateOne({"_id":parseGameId},{$pull:{"reviews": {"_id":parseReviewId} } });
    if(updatedGameReview.modifiedCount === 0) throw "could not delete review successfully."

    return "successful delete";
}

module.exports = {
    createReview,
    getAllReviews,
    getReviewById,
    getReview,
    updateReview,
    deleteReview
}
