/* Methods for calculations
 ---------------------------------------------------------------------------*/
 const data = require('../../data');
 const path = require('path');
 
 const mongoCollections = require('../../config/mongoCollections');
 const games = mongoCollections.games;
 const gamesData = data.games;

/**
 * Update a game's review score with the average of all of its review scores.
 */
// let gamesList = await gamesData.getAllGames();
// let total = 0, avgRating;
// for (let i = 0; i < gamesList.length; i++) {
//     let game = gamesList[i];
//     for (let j = 0; j < game.reviews.length; j++) {
//         let review = game.reviews[j];
//         total += review.rating;
//     }
//     avgRating = total/game.reviews.length;
//     await gamesData.updateGameRating(game._id, avgRating)
// }