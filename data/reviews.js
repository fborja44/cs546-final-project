/* Database methods related to the reviews subdocument
 ---------------------------------------------------------------------------*/
 const mongoCollections = require('../config/mongoCollections');
 const games = mongoCollections.games;
 const users = mongoCollections.users;
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
    if (!gameId) throw "A gameId must be provided";
    if (typeof gameId !== 'string') throw `${gameId || "provided argument"} must be a string`;
    if (gameId.trim().length === 0) throw "The gameId must not be an empty string";
    let parsedGameId = ObjectId(gameId.trim()); // Check if its a valid id

    // reviewTitle error checking
    if (!reviewTitle) throw "A reviewTitle must be provided";
    if (typeof reviewTitle !== 'string') throw `${reviewTitle || "provided argument"} must be a string`;
    if (reviewTitle.trim().length === 0) throw "The reviewTitle must not be an empty string";
    if (reviewTitle.trim().length >= 50) throw "The reviewTitle must be less than 50 characters";

    // author error checking
    if (!author) throw "An author must be provided";
    if (typeof author !== 'object') throw `${author || "provided argument"} must be an object`;
    if (Array.isArray(author)) throw "The author must be an object";
    if (author === null) throw "The author must be not null";
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
    if (typeof rating !== 'number' || !Number.isInteger(rating)) throw `${rating || "provided argument"} must be an integer.`;
    if (rating < 1 || rating > 5) throw "The rating must be an integer in the range [1-5]";
    if (isNaN(rating)) throw "The rating must not be NaN";

    const gameCollection = await games();
    const userCollection = await users();

    let gameInfo;
    try { 
        gameInfo = await gamesData.getGameById(gameId)
        } catch(e){
           throw "Invalid gameId. Could get game by Id";
        }
    let parsedAuthorId = ObjectId(author._id.trim());

    // Check if user had already posted a review for that game
    for (review of gameInfo.reviews) {
        if (review.author._id == author._id){
            throw "Users may not post multiple reviews for a game.";
        }
    }
    
    let newReview = {
        _id: ObjectId(),
        gameId: parsedGameId, // change back to string if doesn't work
        reviewTitle: reviewTitle.trim(),
        gameTitle: gameInfo.title,
        author: {
            username: author.username.trim(),
            _id: parsedAuthorId // change back to string if doesn't work 
        },
        reviewDate: reviewDate,
        review: review.trim(),
        replies: [],
        rating: rating,
        reviewLikes:0,
        reviewDislikes:0
    }
    // parsedGameId = ObjectId(gameId);

    const updateInfo = await gameCollection.updateOne(
        { _id: parsedGameId },
        { $addToSet: { reviews: newReview } },
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Failed to create review.';

    const updateInfo2 = await userCollection.updateOne(
        {_id: parsedAuthorId},
        {$addToSet:  { reviews: newReview }},
    );

    newReview._id = newReview._id.toString();
    newReview.gameId = newReview.gameId.toString();
    newReview.author._id = newReview.author._id.toString();

    // Also remember to update the game's average rating!
    let total = 0, avgRating;
    try {
        game = await gamesData.getGameById(gameId);
    } catch (e) {
        throw `Game with id '${gameId} does not exist'`;
    }
    for (let i = 0; i < game.reviews.length; i++) {
        let review = game.reviews[i];
        total += review.rating;
    }
    avgRating = total/game.reviews.length;
    // trim to 1 decimal
    avgRating = parseFloat(avgRating.toFixed(1));
    let updateGameRatingInfo;
    try {
        updateGameRatingInfo = await gamesData.updateGameRating(gameId, avgRating);
    } catch (e) {
        throw "Could not update game rating";
    }

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

    let parsedGameId = ObjectId(gameId.trim());

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
async function updateReview(gameId,reviewId, reviewTitle,author,reviewDate, review, rating){

    // gameId error checking
    if (!gameId) throw "A gameId must be provided";
    if (typeof gameId !== 'string') throw `${gameId || "gameId provided argument"} must be a string`;
    if (gameId.trim().length === 0) throw "The gameId must not be an empty string";

    // reviewId error checking
    if (!reviewId) throw "A reviewId must be provided";
    if (typeof reviewId !== 'string') throw `${reviewId || "reviewId provided argument"} must be a string`;
    if (reviewId.trim().length === 0) throw "The gameId must not be an empty string";


    let specificReview = await getReviewById(gameId,reviewId);
    let count = 0;
    // reviewTitle error checking
    if(reviewTitle || reviewTitle.trim().length ===0){
    if (typeof reviewTitle !== 'string') throw `${reviewTitle || "reviewTitle provided argument"} must be a string`;
    if (reviewTitle.trim().length === 0) throw "The reviewTitle must not be an empty string";
    if (reviewTitle.trim().length > 85) throw "Title can't exceed over 85 characters.";
    if(specificReview.reviewTitle === reviewTitle){
            count++;
        }
        specificReview.reviewTitle = reviewTitle
    }

    //author error checking
    if (typeof author !== 'object') throw `${author || "provided argument"} must be a string`;
    if (!author.username) throw "Author's username must be provided";
    if (typeof author.username !== 'string') throw `${author.username || "provided argument"} must be a string`;
    if (author.username.trim().length === 0) throw "Author's username must not be an empty string";
    // author id
    if (!author._id) throw "Author's id must be provided";
    if (typeof author._id !== 'string') throw `${author.username || "provided argument"} must be a string`;
    if (author._id.trim().length === 0) throw "Author's id must not be an empty string";
    specificReview.author = author;

    // reviewDate error checking
    if (reviewDate || reviewDate.trim().length ===0) {
        if (typeof reviewDate !== 'string') throw `${reviewDate || "reviewDate provided argument"} must be a string`;
        if (reviewDate.trim().length === 0) throw "The reviewDate must not be an empty string";
        if (!(moment(reviewDate, 'M/D/YYYY', true).isValid())) throw "The reviewDate must be of the format MM/DD/YYY";
        if(specificReview.reviewDate === reviewDate){
            count++;
        }
        specificReview.reviewDate = reviewDate;
    }

    // review error checking
    if (review || review.trim().length ===0){
        if (typeof review !== 'string') throw `${review || "review provided argument"} must be a string`;
        if (review.trim().length === 0) throw "The review must not be an empty string";
        if (review.trim().length > 125) throw "Body can't exceed over 125 characters.";
        if(specificReview.review === review){
            count++;
        }
        specificReview.review=review;
    }

    // rating error checking
    if (rating || rating.trim().length ===0){
        if (typeof rating !== 'number' || !Number.isInteger(rating)) throw `${rating || "rating provided argument"} must be an integer.`;
        if (rating < 1 || rating > 5) throw "The rating must be an integer in the range [1-5]"
        if (isNaN(rating)) throw "The rating must not be NaN";
        if(specificReview.rating === rating){
            count++;
        }
        specificReview.rating = rating;
    }

    //returns if the updated review is already the same
    if(count === 4){
        return await getReviewById(gameId,reviewId);
    }

    specificReview._id = ObjectId(specificReview._id);
    specificReview.gameId = ObjectId(specificReview.gameId);
    specificReview.author._id = ObjectId(specificReview.author._id);

    const gamesCollection = await games();
    let parsedGameId = ObjectId(gameId);
    let parseReviewId = ObjectId(reviewId);
    const updatedInfo = await gamesCollection.updateOne({_id:parsedGameId,
                                               "reviews._id":parseReviewId},
                                              {$set:{"reviews.$":specificReview}});
    if(updatedInfo.modifiedCount === 0) throw "Could not update reviews successfully."

    // Also remember to update the game's average rating!
    let total = 0, avgRating;
    try {
        game = await gamesData.getGameById(gameId);
    } catch (e) {
        throw `Game with id '${gameId} does not exist'`;
    }
    for (let i = 0; i < game.reviews.length; i++) {
        let review = game.reviews[i];
        total += review.rating;
    }
    avgRating = total/game.reviews.length;
    // trim to 1 decimal
    avgRating = parseFloat(avgRating.toFixed(1));
    let updateGameRatingInfo;
    try {
        updateGameRatingInfo = await gamesData.updateGameRating(gameId, avgRating);
    } catch (e) {
        throw "Edit: Could not update game rating";
    }
  
    return await getReviewById(gameId,reviewId);

}

/**
 * Deletes a review
 * @param {string} gameId
 * @param {string} reviewId
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

    // Also remember to update the game's average rating!
    let total = 0, avgRating;
    let game;
    try {
        game = await gamesData.getGameById(gameId);
    } catch (e) {
        throw `Game with id '${gameId} does not exist'`;
    }
    // Check if there are reviews left after deletion
    if (game.reviews.length > 0) {
        for (let i = 0; i < game.reviews.length; i++) {
            let review = game.reviews[i];
            total += review.rating;
        }
        avgRating = total/game.reviews.length;
        // trim to 1 decimal
        avgRating = parseFloat(avgRating.toFixed(1));
    } else {
        avgRating = 0;
    }
    let updateGameRatingInfo;
    try {
        updateGameRatingInfo = await gamesData.updateGameRating(gameId, avgRating);
    } catch (e) {
        throw "Delete: Could not update game rating";
    }

    return "successful delete";
}


/**
 * Increments a review's like count.
 * @param gameId The id of the game
 * @param reviewId The id of the review
 */
async function incrementLike(gameId,reviewId) {
    if (!gameId) throw "You must provide an game id to search for";
    if (typeof gameId !== "string") throw "The provided game id must be a string";
    if (gameId.trim().length === 0) throw "The provided must not be an empty string";

    if (!reviewId) throw "You must provide an review id to search for";
    if (typeof reviewId !== "string") throw "The provided review id must be a string";
    if (reviewId.trim().length === 0) throw "The provided must not be an empty string";

    const gameCollection = await games();

    let parsedGameId = ObjectId(gameId.trim());
    let parsedReviewId = ObjectId(reviewId.trim());
   
    const updateInfo = await gameCollection.updateOne(
        {_id:parsedGameId,"reviews._id":parsedReviewId},
        { $inc: {"reviews.$.reviewLikes":1 }}
    );

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw "Failed to update reviews likes.";


    return await this.getReviewById(gameId,reviewId);
}


/**
 * Increments a review's like count.
 * @param gameId The id of the game
 * @param reviewId The id of the review
 */
async function incrementDislike(gameId,reviewId) {
    if (!gameId) throw "You must provide an game id to search for";
    if (typeof gameId !== "string") throw "The provided game id must be a string";
    if (gameId.trim().length === 0) throw "The provided must not be an empty string";

    if (!reviewId) throw "You must provide an review id to search for";
    if (typeof reviewId !== "string") throw "The provided review id must be a string";
    if (reviewId.trim().length === 0) throw "The provided must not be an empty string";

    const gameCollection = await games();

    let parsedGameId = ObjectId(gameId.trim());
    let parsedReviewId = ObjectId(reviewId.trim());

    const updateInfo = await gameCollection.updateOne(
        {_id:parsedGameId,"reviews._id":parsedReviewId},
        { $inc: {"reviews.$.reviewDislikes":1 }}
    );

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw "Failed to update reviews likes.";


    return await this.getReviewById(gameId,reviewId);
}


/**
 * Decrements a review's like count.
 * @param gameId The id of the game
 * @param reviewId The id of the review
 */
 async function decrementLike(gameId,reviewId) {
    if (!gameId) throw "You must provide an game id to search for";
    if (typeof gameId !== "string") throw "The provided game id must be a string";
    if (gameId.trim().length === 0) throw "The provided must not be an empty string";

    if (!reviewId) throw "You must provide an review id to search for";
    if (typeof reviewId !== "string") throw "The provided review id must be a string";
    if (reviewId.trim().length === 0) throw "The provided must not be an empty string";

    const gameCollection = await games();


    let parsedGameId = ObjectId(gameId.trim());
    let parsedReviewId = ObjectId(reviewId.trim());

    const updateInfo = await gameCollection.updateOne(
        {_id:parsedGameId,"reviews._id":parsedReviewId},
        { $inc: {"reviews.$.reviewLikes":-1 }}
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw "Failed to update reviews likes.";

    return await this.getReviewById(gameId,reviewId);
}



/**
 * Decrements a review's dislike count.
 * @param gameId The id of the game
 * @param reviewId The id of the review
 */
 async function decrementDislike(gameId,reviewId) {
    if (!gameId) throw "You must provide an game id to search for";
    if (typeof gameId !== "string") throw "The provided game id must be a string";
    if (gameId.trim().length === 0) throw "The provided must not be an empty string";

    if (!reviewId) throw "You must provide an review id to search for";
    if (typeof reviewId !== "string") throw "The provided review id must be a string";
    if (reviewId.trim().length === 0) throw "The provided must not be an empty string";

    const gameCollection = await games();


    let parsedGameId = ObjectId(gameId.trim());
    let parsedReviewId = ObjectId(reviewId.trim());

    const updateInfo = await gameCollection.updateOne(
        {_id:parsedGameId,"reviews._id":parsedReviewId},
        { $inc: {"reviews.$.reviewDislikes":-1 }}
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw "Failed to update reviews likes.";

    return await this.getReviewById(gameId,reviewId);
}

module.exports = {
    createReview,
    getAllReviews,
    getReviewById,
    getReview,
    updateReview,
    deleteReview,
    incrementLike,
    incrementDislike,
    decrementLike,
    decrementDislike
}
