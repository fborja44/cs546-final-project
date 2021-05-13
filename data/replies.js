const mongoCollections = require('../config/mongoCollections');
const games = mongoCollections.games;
const users = mongoCollections.users;
let { ObjectId } = require('mongodb');
const moment = require('moment'); // for date checking
const gamesData = require('./games'); // games database methods
const reviewData = require('./reviews');
const userData = require('./users');

/**
 * 
 * @param {string} gameId 
 * @param {string} userId 
 * @param {string} replyDate 
 * @param {string} reply 
 */
async function createReply(gameId, reviewId, userId, replyDate, reply) {
    // Error checking
    // -----------------------------------------------
    // gameId Error checking
    if (!gameId) {
        throw "A gameId must be provided";
    }
    if (typeof gameId !== 'string') {
        throw "The gameId must be a string";
    }
    if (gameId.trim().length === 0) {
        throw "The gameId must not be an empty string";
    }
    let parsedGameId = ObjectId(gameId.trim());

    // reviewId Error checking
    if (!reviewId) {
        throw "A reviewId must be provided";
    }
    if (typeof reviewId !== 'string') {
        throw "The reviewId must be a string";
    }
    if (reviewId.trim().length === 0) {
        throw "The reviewId must not be an empty string";
    }
    let parsedReviewId = ObjectId(reviewId.trim());

    // userId Error checking
    if (!userId) {
        throw "A userId must be provided";
    }
    if (typeof userId !== 'string') {
        throw "The userId must be a string";
    }
    if (userId.trim().length === 0) {
        throw "The userId must not be an empty string";
    }
    let parsedUserId = ObjectId(userId.trim());

    // replyDate Error checking
    if (!replyDate) throw "The replyDate must be provided";
    if (typeof replyDate !== 'string') throw `${replyDate || "provided argument"} must be a string`;
    if (replyDate.trim().length === 0) throw "The replyDate must not be an empty string";
    if (!(moment(replyDate, 'M/D/YYYY', true).isValid())) throw "The replyDate must be of the format MM/DD/YYY";

    // reply Error checking
    if (!reply) {
        throw "A reply must be provided";
    }
    if (typeof reply !== 'string') {
        throw "The reply must be a string";
    }
    if (reply.trim().length === 0) {
        throw "The reply must not be an empty string";
    }

    const gameCollection = await games();
    const userCollection = await users();

    let allUsers;
    try {
        allUsers = await userData.getAllUsers();
    } catch (e) {
        throw "Could not get all users";
    }

    let userInfo;
    try {
        userInfo = await userData.getUserById(userId.trim());
    } catch (e) {
        throw "Could not get user by id";
    }

    let newReply = {
        _id: parsedUserId,
        username: userInfo.username,
        replyDate: replyDate.trim(),
        reply: reply.trim()
    }

    let usersToUpdate = [];

    for (let x of allUsers) {
        for (let y of x.reviews) {
            if (y._id.toString() === reviewId.trim()) {
                y.replies.push(newReply);
                usersToUpdate.push(x);
                break;
            }
        }
    }


    let gameInfo;
    try {
        gameInfo = await gamesData.getGameById(gameId.trim());
    } catch (e) {
        throw "Invalid gameId. Cannot get game by id";
    }

    for (let x of gameInfo.reviews) {
        if (x._id.toString() === reviewId.trim()) {
            x.replies.push(newReply);
        }
    }

    delete gameInfo._id;

    const updatedInfo = await gameCollection.replaceOne({_id: parsedGameId}, gameInfo);
    if (updatedInfo.modifedCount === 0) {
        throw "Could not update successfully";
    }

    for (let x of usersToUpdate) {
        let parsedId = ObjectId(x._id);
        delete x._id;
        let updatedInfo2 = await userCollection.replaceOne({_id: parsedId}, x);
        if (updatedInfo2.modifiedCount === 0) {
            throw "Could not update successfully";
        }
    }

    return this.getRepliesById(reviewId.trim());
}

async function getRepliesById(reviewId) {
    if (!reviewId) {
        throw "A reviewId must be provided";
    }
    if (typeof reviewId !== 'string') {
        throw "The reviewId must be a string";
    }
    if (reviewId.trim().length === 0) {
        throw "The reviewId must not be an empty string";
    }
    let parsedReviewId = ObjectId(reviewId.trim());

    let reviewInfo;
    try {
        reviewInfo = await reviewData.getReview(reviewId.trim());
    } catch (e) {
        throw "Could not find review";
    }

    for (let x of reviewInfo.replies) {
        x._id = x._id.toString();
    }

    return reviewInfo.replies;
}

module.exports = {
    createReply,
    getRepliesById
}
