/* Database methods related to games
 ---------------------------------------------------------------------------*/
const mongoCollections = require('../config/mongoCollections');
const games = mongoCollections.games;
let { ObjectId } = require('mongodb');

// https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
const validURL = new RegExp('^(https?:\\/\\/)?'+ // protocol
'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
'(\\#[-a-z\\d_]*)?$','i'); // fragment locator

const validPrice = /^\$(\d+\.\d{1,2})$/

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
    // title error checking
    if (!title) throw "A title must be provided";
    if (typeof title !== 'string') throw `${title || "provided argument"} must be a string`;
    if (title.trim().length === 0) throw "The title must not be an empty string";

    // image error checking
    if (!image) throw "An image must be provided";
    if (typeof image !== 'string') throw `${image || "provided argument"} must be a string`;
    if (image.trim().length === 0) throw "The image must not be an empty string";
    
    if (!validURL.test(image)) throw `${image || "provided argument"} must be a valid url`;

    // publisher error checking
    if (!publisher) throw "A publisher must be provided";
    if (typeof publisher !== 'string') throw `${publisher || "provided argument"} must be a string`;
    if (publisher.trim().length === 0) throw "The publisher must not be an empty string";

    // genres error checking
    if (!genres) throw "A genres array must be provided";
    if (!Array.isArray(genres)) throw `${genres || "provided argument"} must be an array`;
    if (genres.length === 0) throw "The genres array must have at least one genre";
    let genresTrim = [];
    for (let x of genres) {
        if (typeof x !== 'string') throw `${x || "provided argument"} must be a string`;
        if (x.trim().length === 0) throw "The genre must not be an empty string";
        genresTrim.push(x.trim());
    }

    // releaseYear error checking
    if (!releaseYear) throw "A releaseYear must be provided";
    if (typeof releaseYear !== 'string') throw `${releaseYear || "provided argument"} must be a string`;
    if (releaseYear.trim().length === 0) throw "The releaseYear must not be an empty string";
    if (releaseYear.trim().length !== 4) throw "The releaseYear must be a valid year";
    const releaseYearParsed = parseInt(releaseYear);
    if (isNaN(releaseYearParsed)) throw "The releaseYear must be a valid year";
    let d = new Date();
    if (releaseYearParsed < 1930 || releaseYearParsed > d.getFullYear() + 5) throw "The releaseYear must be a valid year";

    // platforms error checking
    if (!platforms) throw "A platforms array must be provided";
    if (!Array.isArray(platforms)) throw `${platforms || "provided argument"} must be an array`;
    if (platforms.length === 0) throw "The platforms array must have at least one platform";
    let platformsTrim = [];
    for (let x of platforms) {
        if (typeof x !== 'string') throw `${x || "provided argument"} must be a string`;
        if (x.trim().length === 0) throw "The platform must not be an empty string";
        platformsTrim.push(x.trim());
    }

    // description error checking
    if (!description) throw "A description must be provided";
    if (typeof description !== 'string') throw `${description || "provided argument"} must be a string`;
    if (description.trim().length === 0) throw "The description must not be an empty string";

    // prices error checking
    if (!prices) throw "A prices array must be provided";
    if (!Array.isArray(prices)) throw `${prices || "provided argument"} must be an array`;
    if (prices.length === 0) throw "The prices array must have at least one price"
    let pricesTrim = []
    for (let x of prices) {
        if (typeof x !== 'object') throw `${x || "provided argument"} must be an object`;
        if (Array.isArray(x)) throw `${x || "provided argument"} must be an object`;
        if (x === null) throw `${x || "provided argument"} must be an object`
        if (Object.keys(x).length !== 2) throw "The price must be of the correct format";

        let obj = {};
        // price error checking
        if (!x.price) throw "The price must be provided";
        if (typeof x.price !== 'string') throw `${x.price || "provided argument"} must be a string`;
        if (x.price.trim().length === 0) throw "The price must not be an empty string";
        if (!validPrice.test(x.price)) throw `${x.price || "provided argument"} must be a valid price`;
        obj.price = x.price.trim();

        // platform error checking
        if (!x.platform) throw "The platform must be provided";
        if (typeof x.platform !== 'string') throw `${x.platform || "provided argument"} must be a string`;
        if (x.platform.trim().length === 0) throw "The platform must not be an empty string";
        obj.platform = x.platform.trim();

        pricesTrim.push(obj);
    }

    const gameCollection = await games();

    let newGame = {
        title: title.trim(),
        image: image.trim(),
        publisher: publisher.trim(),
        genres: genresTrim,
        releaseYear: releaseYear.trim(),
        platforms: platformsTrim,
        description: description,
        prices: pricesTrim,
        averageRating: 0,
        reviews: [],
    };

    const insertInfo = await gameCollection.insertOne(newGame);
    if (insertInfo.insertedCount === 0) throw "Could not create game";
    const id = insertInfo.insertedId.toString();

    const game = await this.getGameById(id);
    return game;
}

/**
 * Retrieves all games in the database.
 */
async function getAllGames() {
    const gameCollection = await games();

    const gameList = await gameCollection.find({}).toArray();

    if (gameList.length === 0) return [];

    for (let x of gameList) {
        x._id = x._id.toString();
    }

    return gameList;
}

/**
 * Retrieves a game in the databse with the given id.
 * @param {string} id String representation of the ObjectId of the game.
 */
async function getGameById(id) {
    if (!id) throw "You must provide an id to search for";
    if (typeof id !== "string") throw "The provided id must be a string";
    if (id.trim().length === 0) throw "The provided must not be an empty string";

    let parsedId = ObjectId(id.trim());

    const gameCollection = await games();
    const game = await gameCollection.findOne({ _id: parsedId });
    if (game === null) throw "No game with that id";
    game._id = game._id.toString();

    return game;
}

/**
 * Retrieves a game in the databse with the given title
 * @param {string} tile String representation of the ObjectId of the game.
 */
 async function getGameByTitle(title) {
    if (!title) throw "You must provide an id to search for";
    if (typeof title !== "string") throw "The provided id must be a string";
    if (title.trim().length === 0) throw "The provided must not be an empty string";

    const gameCollection = await games();
    const game = await gameCollection.findOne({ title: title });
    if (game === null) throw "No game with that title";
    game._id = game._id.toString();

    return game;
}

/**
 * Updates a game in the database with the given id's average rating.
 * @param {string} id String representation of the ObjectId of the game.
 */
 async function updateGameRating(id, rating) {
    if (!id) throw "You must provide an id to search for";
    if (typeof id !== "string") throw "The provided id must be a string";
    if (id.trim().length === 0) throw "The provided must not be an empty string";

    if (rating === null) throw "You must provide a rating";
    if (typeof rating !== 'number') throw "The provided rating is not a number";
    if (rating > 5 || rating < 1) throw "Rating must be in the valid range of (1-5)";

    let parsedId = ObjectId(id);

    const gameCollection = await games();
    const updateInfo = await gameCollection.updateOne(
        { _id: parsedId },
        { $set: { averageRating: rating } }
    )
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
        throw new Error(`Failed to update game's rating.`);
    return await this.getGameById(id);
}

/**
 * Updates a game in the database with the given id.
 * @param {string} id String representation of the ObjectId of the game.
 * @param {object} updatedGame Object containing data to update game.
 */
async function updateGameById(id, updatedGame) {
    // id error checking
    if (!id) throw "An id must be provided";
    if (typeof id !== 'string') throw "The provided id must be a string";
    if (id.trim().length === 0) throw "The provided id must not be an empty string";
    let parsedId = ObjectId(id.trim());

    // // method error checking
    // if (!method) throw "A method must be provided";
    // if (typeof method !== 'string') throw "The method must be a string";
    // if (id.trim().length === 0) throw "The method must not be an empty string";
    // let method = method.trim();

    // updatedGame error checking
    if (!updatedGame) throw "updatedGame must be provided";

    const updatedGameData = {};

    if (updatedGame.title) {
        let title = updatedGame.title;
        if (typeof title !== 'string') throw `${title || "provided argument"} must be a string`;
        if (title.trim().length === 0) throw "The title must not be an empty string";
        updatedGameData.title = title.trim();
    }

    if (updatedGame.image) {
        let image = updatedGame.image;
        if (typeof image !== 'string') throw `${image || "provided argument"} must be a string`;
        if (image.trim().length === 0) throw "The image must not be an empty string";
        if (!validURL.test(image)) throw `${image || "provided argument"} must be a valid url`;
        updatedGameData.image = image.trim();
    }

    if (updatedGame.publisher) {
        let publisher = updatedGame.publisher;
        if (typeof publisher !== 'string') throw `${publisher || "provided argument"} must be a string`;
        if (publisher.trim().length === 0) throw "The publisher must not be an empty string";
        updatedGameData.publisher = publisher.trim();
    }

    if (updatedGame.genres) {
        let genres = updatedGame.genres;
        if (!Array.isArray(genres)) throw `${genres || "provided argument"} must be an array`;
        if (genres.length === 0) throw "The genres array must have at least one genre";
        let genresTrim = [];
        for (let x of genres) {
            if (typeof x !== 'string') throw `${x || "provided argument"} must be a string`;
            if (x.trim().length === 0) throw "The genre must not be an empty string";
            genresTrim.push(x.trim());
        }
        updatedGameData.genres = genresTrim;
    }

    if (updatedGame.releaseYear) {
        let releaseYear = updatedGame.releaseYear;
        if (typeof releaseYear !== 'string') throw `${releaseYear || "provided argument"} must be a string`;
        if (releaseYear.trim().length === 0) throw "The releaseYear must not be an empty string";
        if (releaseYear.trim().length !== 4) throw "The releaseYear must be a valid year";
        const releaseYearParsed = parseInt(releaseYear);
        if (isNaN(releaseYearParsed)) throw "The releaseYear must be a valid year";
        let d = new Date();
        if (releaseYearParsed < 1930 || releaseYearParsed > d.getFullYear() + 5) throw "The releaseYear must be a valid year";
        updatedGameData.releaseYear = releaseYear.trim();
    }

    if (updatedGame.platforms) {
        let platforms = updatedGame.platforms;
        if (!Array.isArray(platforms)) throw `${platforms || "provided argument"} must be an array`;
        if (platforms.length === 0) throw "The platforms array must have at least one platform";
        let platformsTrim = [];
        for (let x of platforms) {
            if (typeof x !== 'string') throw `${x || "provided argument"} must be a string`;
            if (x.trim().length === 0) throw "The platform must not be an empty string";
            platformsTrim.push(x.trim());
        }
        updatedGameData.platforms = platformsTrim;
    }

    if (updatedGame.description) {
        let description = updatedGame.description;
        if (typeof description !== 'string') throw `${description || "provided argument"} must be a string`;
        if (description.trim().length === 0) throw "The description must not be an empty string";
        updatedGameData.description = description.trim();
    }

    if (updatedGame.prices) {
        let prices = updatedGame.prices;
        if (!Array.isArray(prices)) throw `${prices || "provided argument"} must be an array`;
        if (prices.length === 0) throw "The prices array must have at least one price"
        let pricesTrim = []
        for (let x of prices) {
            if (typeof x !== 'object') throw `${x || "provided argument"} must be an object`;
            if (Array.isArray(x)) throw `${x || "provided argument"} must be an object`;
            if (x === null) throw `${x || "provided argument"} must be an object`
            if (Object.keys(x).length !== 2) throw "The price must be of the correct format";

            let obj = {};
            // price error checking
            if (!x.price) throw "The price must be provided";
            if (typeof x.price !== 'string') throw `${x.price || "provided argument"} must be a string`;
            if (x.price.trim().length === 0) throw "The price must not be an empty string";
            if (!validPrice.test(x.price)) throw `${x.price || "provided argument"} must be a valid price`;
            obj.price = x.price.trim();

            // platform error checking
            if (!x.platform) throw "The platform must be provided";
            if (typeof x.platform !== 'string') throw `${x.platform || "provided argument"} must be a string`;
            if (x.platform.trim().length === 0) throw "The platform must not be an empty string";
            obj.platform = x.platform.trim();

            pricesTrim.push(obj);
        }
        updatedGameData.prices = pricesTrim;
    }

    const gameCollection = await games();

    const updateInfo = await gameCollection.updateOne(
        { _id: parsedId },
        { $set: updatedGameData }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw "Update failed";

    return await this.getGameById(id.trim());
}

/**
 * Deletes a game from the databse with the given id.
 * @param {string} id String representation of the ObjectId of the game.
 */
async function removeGameById(id) {
    if (!id) throw "An id must be provided";
    if (typeof id !== 'string') throw "The id must be a string";
    if (id.trim().length === 0) throw "The id must not be an empty string";
    let parsedId = ObjectId(id.trim());

    const gameCollection = await games();
    const deletionInfo = await gameCollection.deleteOne({ _id: parsedId });
    if (deletionInfo.deletedCount === 0) {
        throw "Could not delete book";
    }

    return true;
}

module.exports = {
    createGame,
    getAllGames,
    getGameById,
    getGameByTitle,
    updateGameRating,
    updateGameById,
    removeGameById
};