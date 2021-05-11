/* Database methods related to users
 ---------------------------------------------------------------------------*/
 const mongoCollections = require('../config/mongoCollections');
 const users = mongoCollections.users;
 let { ObjectId } = require('mongodb');
 const bcrypt = require('bcryptjs');
 const saltRounds = 16;
 const gamesData = require('./games'); // games database methods
 
 /**
  * Creates a user in the database using the following parameters:
  * @param {string} username A unique name that will be displayed across the site for the user.
  * @param {string} firstName The first name of the user.
  * @param {string} lastName The last name of the user.
  * @param {string} email The email of the user.
  * @param {string} password The password of the user used to log in.
  */
 async function createUser(username, firstName, lastName, email, password) {
	 if(!username || !firstName || !lastName || !email || !password)
		 throw "The infomation of username, firstname, lastname and email must be provided."
	 if(typeof username != 'string' || username.trim() === '')
		 throw `User Name ${userName} should be a string which is not empty.`
	 if(typeof firstName != 'string' || firstName.trim() === '')
		 throw `First Name ${firstName} should be a string which is not empty.`
	 if(typeof lastName != 'string' || lastName.trim() === '')
		 throw `Last Name ${lastName} should be a string which is not empty.`
	 if(typeof email != 'string' || email.trim() === '')
		 throw `Email ${email} should be a string which is not empty.`
	 if(typeof password != 'string' || password.trim() === '')
		 throw `Password ${password} should be a string which is not empty.`
		 
	 const emailPattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	 if (!emailPattern.test(email))
		 throw "Error: Invaild email."
	let newPassword = password.trim();
	if (newPassword.length < 4 || newPassword.length > 20)
		throw `Password is too long or too short.`
	 const hashedPassword = await bcrypt.hash(password, saltRounds);

	 const userCollection = await users();
	 let newUser = {
		 username: username.trim().toLowerCase(),
		 firstName: firstName,
		 lastName: lastName,
		 email: email,
		 hashedPassword: hashedPassword,
		 likes: [],
		 follows: [],
		 wishlist: [],
		 reviews: [],
         reviewLikes:[],
         reviewDislikes:[]
	 };
 
	 const insertInfo = await userCollection.insertOne(newUser);
	 if(insertInfo.insertedCount === 0) throw "Failed to create a new user."
 
	 const newId = insertInfo.insertedId.toString();
	 const res = await getUserById(newId);
	 return res;
 }
 
 /**
  * Retrieves all users in the database. The user id is a string rather than a objectId.
  */
 async function getAllUsers() {
	 const userCollection = await users();
	 const userList = await userCollection.find({}).toArray();
	 if(userList.length == 0){
		 return userList;
	 }else{
		 userList.forEach((user) => {
			 user._id = user._id.toString();
		 })
	 }
	 return userList;
 }
 
 /**
  * Retrieves a user in the databse with the given id.
  * @param string id String representation of the ObjectId of the user.
  */
 async function getUserById(id) {
	 if(!id || typeof id != 'string') throw "Id should be provied and it is a string."
	 if(id.trim() === '') throw "The input is an empty string."
	 if(!ObjectId.isValid(id)) throw "Invalid ObjectId."
	 let parsedId = ObjectId(id);
	 const userCollection = await users();
	 const res = await userCollection.findOne({_id: parsedId});
	 if(res === null) throw "Not found. No such ID in database."
	 res._id = res._id.toString();
	 return res;
 }
 
 /**
  * Updates a user's username in the database with the given id.
  * @param {string} id String representation of the ObjectId of the user.
  * @param {string} newInfo the updated information of the user.
  */
 /**
  * async function updateUsername(id, newUsername) {
	 if(!id || typeof id != 'string') throw "Id should be provied and it is a string."
	 if(id.trim() === '') throw "The input is an empty string."
	 if(!ObjectId.isValid(id)) throw "Invalid ObjectId."
	 let parsedId = ObjectId(id);
	 if(!newUsername || newUsername.trim() == '')
		 throw "No username provided."
	 const newUser = newUsername.trim();
	 if(!usernameCheck(newUser))
		 throw "The username exists the same username, please try another one."
 
	 const userCollection = await users();
	 return await userCollection
		 .updateOne({_id: parsedId}, {$set: {username: newUser}})
		 .then(async function (){
			 return await module.exports.getUserById(id);
		 });
 }
 */
 
 async function updateFirstName(id, newName) {
	 if(!id || typeof id != 'string') throw "Id should be provied and it is a string."
	 if(id.trim() === '') throw "The input is an empty string."
	 if(!ObjectId.isValid(id)) throw "Invalid ObjectId."
	 let parsedId = ObjectId(id);
	 if(!newName || typeof newName != 'string' || newName.trim() == '')
		 throw "No first name provided."
	 const newInfo = newName.trim();
 
	 const userCollection = await users();
	 return await userCollection
		 .updateOne({_id: parsedId}, {$set: {firstName: newInfo}})
		 .then(async function (){
			 return await module.exports.getUserById(id);
		 });
 }
 
 async function updateLastName(id, newName) {
	 if(!id || typeof id != 'string') throw "Id should be provied and it is a string."
	 if(id.trim() === '') throw "The input is an empty string."
	 if(!ObjectId.isValid(id)) throw "Invalid ObjectId."
	 let parsedId = ObjectId(id);
	 if(!newName || typeof newName != 'string' ||newName.trim() == '')
		 throw "No last name provided."
	 const newInfo = newName.trim();

	 const userCollection = await users();
	 return await userCollection
		 .updateOne({_id: parsedId}, {$set: {lastName: newInfo}})
		 .then(async function (){
			 return await module.exports.getUserById(id);
		 });
 }
 
 async function updateEmail(id, newEmail) {
	 if(!id || typeof id != 'string') throw "Id should be provied and it is a string."
	 if(id.trim() === '') throw "The input is an empty string."
	 if(!ObjectId.isValid(id)) throw "Invalid ObjectId."
	 let parsedId = ObjectId(id);
	 if(!newEmail || typeof newEmail != 'string' || newEmail.trim() == '')
		 throw "No email provided."
	 const newInfo = newEmail.trim();
 
	 const emailPattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	 if (!emailPattern.test(newInfo))
		 throw "Error: Invaild email."
 
	 const userCollection = await users();
	 return await userCollection
		 .updateOne({_id: parsedId}, {$set: {email: newInfo}})
		 .then(async function (){
			 return await module.exports.getUserById(id);
		 });
 }
 
 async function updatePassword(id, newPassword) {
	 if(!id || typeof id != 'string') throw "Id should be provied and it is a string."
	 if(id.trim() === '') throw "The input is an empty string."
	 if(!ObjectId.isValid(id)) throw "Invalid ObjectId."
	 let parsedId = ObjectId(id);
	 if(!newPassword || typeof newPassword != 'string' || newPassword.trim() == '')
		 throw "No password provided."
	 if (newPassword && (newPassword.length < 4 || newPassword.length > 20))
			throw "Password is too long or too short.";
 
	 const newInfo = await bcrypt.hash(newPassword.trim(), saltRounds);
	 
	 const userCollection = await users();
	 return await userCollection
		 .updateOne({_id: parsedId}, {$set: {hashedPassword: newInfo}})
		 .then(async function (){
			 return await module.exports.getUserById(id);
		 });
 }
 
 async function updateLikes(id, likes) {
	 if(!id || typeof id != 'string') throw "Id should be provied and it is a string."
	 if(id.trim() === '') throw "The input is an empty string."
	 if(!ObjectId.isValid(id)) throw "Invalid ObjectId."
	 let parsedId = ObjectId(id);
	 
	 if(!likes || !Array.isArray(likes))
		 throw "Likes list is not an array."
	 
	 const userCollection = await users();
	 return await userCollection
		 .updateOne({_id: parsedId}, {$set: {likes: likes}})
		 .then(async function (){
			 return await module.exports.getUserById(id);
		 });
 }
 
 async function updateFollows(id, follows) {
	 if(!id || typeof id != 'string') throw "Id should be provied and it is a string."
	 if(id.trim() === '') throw "The input is an empty string."
	 if(!ObjectId.isValid(id)) throw "Invalid ObjectId."
	 let parsedId = ObjectId(id);
	 
	 if(!follows || !Array.isArray(follows))
		 throw "Follows list is not an array."
	 
	 const userCollection = await users();
	 return await userCollection
		 .updateOne({_id: parsedId}, {$set: {follows: follows}})
		 .then(async function (){
			 return await module.exports.getUserById(id);
		 });
 }
 
 async function updateWishlist(id, wishlist) {
	 if(!id || typeof id != 'string') throw "Id should be provied and it is a string."
	 if(id.trim() === '') throw "The input is an empty string."
	 if(!ObjectId.isValid(id)) throw "Invalid ObjectId."
	 let parsedId = ObjectId(id);
	 
	 if(!wishlist || !Array.isArray(wishlist))
		 throw "Wishlist is not an array."
	 
	 const userCollection = await users();
	 return await userCollection
		 .updateOne({_id: parsedId}, {$set: {wishlist: wishlist}})
		 .then(async function (){
			 return await module.exports.getUserById(id);
		 });
 }
 
 async function updateReviews(id, reviews) {
	 if(!id || typeof id != 'string') throw "Id should be provied and it is a string."
	 if(id.trim() === '') throw "The input is an empty string."
	 if(!ObjectId.isValid(id)) throw "Invalid ObjectId."
	 let parsedId = ObjectId(id);
	 
	 if(!reviews || !Array.isArray(reviews))
		 throw "Reviews list is not an array."
	 
	 const userCollection = await users();
	 return await userCollection
		 .updateOne({_id: parsedId}, {$set: {reviews: reviews}})
		 .then(async function (){
			 return await module.exports.getUserById(id);
		 });
 }
 
 /**
  * Deletes a user from the databse with the given id.
  * @param {string} id String representation of the ObjectId of the user.
  */
 async function removeUserById(id) {
	 if(!id || typeof id != 'string') throw "Id should be provied and it is a string."
	 if(id.trim() === '') throw "The input is an empty string."
	 if(!ObjectId.isValid(id)) throw "Invalid ObjectId."
	 let parsedId = ObjectId(id);
	 const userCollection = await users();
	 const findUser = await userCollection.findOne({_id: parsedId});
	 const deletionInfo = await userCollection.deleteOne({_id: parsedId});
	 if(deletionInfo.deletedCount === 0) throw `Can not delete the movie with id ${id}`;
	 return `${findUser.userName} has been successfully deleted. `
 }
 
 /**
  * Before create a new user in database, to check the uniqueness of the new username. True means there is no such username.
  * @param {username} username A unique name that will be displayed across the site for the user.
  */
 async function usernameCheck(username) {
	 if(!username || typeof username != 'string' || username.trim() === '')
		 throw "username should be a string."
	 const newUsername = username.trim().toLowerCase();
 
//	 const userCollection = await users();
	 const userList = await getAllUsers();
	 userList.forEach((user) => {
		 if (newUsername == user.username.toLowerCase()){
			 return false;
		 }
	 })
	 return true;
 
 }
/**
 * Return _id based on the username.
 * @param {string} username 
 */
 async function getUserByUsername(username) {
	if(!username || typeof username != 'string') throw "Username should be provied and it is a string."
	 if(username.trim() === '') throw "The input is an empty string."
	 let name = username.trim().toLowerCase();
	 const userCollection = await users();
	 const res = await userCollection.findOne({username: name});
	 if(res === null) 
	 	return null;
	 res._id = res._id.toString();
	 return res;
 }

/**
 * Adds a game id to a user's liked list
 * @param {*} userId 
 * @param {*} gameId 
 * @returns 
 */
async function addLikedGame(userId, gameId) {
	// Check userId
	if (!userId) throw "You must provide an user id";
    if (typeof userId !== "string") throw "The provided user id must be a string";
    if (userId.trim().length === 0) throw "The provided user id must not be an empty string";

	// Check gameId
	if (!gameId) throw "You must provide a game id";
    if (typeof gameId !== "string") throw "The provided game id must be a string";
    if (gameId.trim().length === 0) throw "The provided game id must not be an empty string";

	let user;
	// Check to make sure user with the userId exists
	try {
		user = await getUserById(userId);
	} catch (e) {
		throw `User with id ${userId} does not exist.`
	}

	// Check to make sure that a game with the gameId exists
	let game;
	try {
		game = await gamesData.getGameById(gameId);
	} catch (e) {
		throw `Game with id ${gameId} does not exist.`
	}

	// Check if game has already been added to likes list
	for (let x of user.likes) {
		if (x._id.toString() === gameId) {
			throw `User has already liked the game with id of ${gameId}`;
		}
	}

	let parsedUserId = ObjectId(userId);
	let parsedGameId = ObjectId(gameId);

	let liked_obj = {
		_id: parsedGameId,
		title: game.title
	}

	const userCollection = await users();
	const updateInfo = await userCollection.updateOne(
        { _id: parsedUserId },
        { $addToSet: { likes: liked_obj } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Failed to add game to likes.';
	return await getUserById(userId);
}

/**
 * Adds a game id to a user's wishlist
 * @param {*} userId 
 * @param {*} gameId 
 * @returns 
 */
 async function addWishlistGame(userId, gameId) {
	// Check userId
	if (!userId) throw "You must provide an user id";
    if (typeof userId !== "string") throw "The provided user id must be a string";
    if (userId.trim().length === 0) throw "The provided user id must not be an empty string";

	// Check gameId
	if (!gameId) throw "You must provide a game id";
    if (typeof gameId !== "string") throw "The provided game id must be a string";
    if (gameId.trim().length === 0) throw "The provided game id must not be an empty string";

	let user;
	// Check to make sure user with the userId exists
	try {
		user = await getUserById(userId);
	} catch (e) {
		throw `User with id ${userId} does not exist.`
	}

	// Check to make sure that a game with the gameId exists
	let game;
	try {
		game = await gamesData.getGameById(gameId);
	} catch (e) {
		throw `Game with id ${gameId} does not exist.`
	}

	// Check if game has already been added to likes list
	for (let x of user.wishlist) {
		if (x._id.toString() === gameId) {
			throw `User has already liked the game with id of ${gameId}`;
		}
	}

	let parsedUserId = ObjectId(userId);
	let parsedGameId = ObjectId(gameId);

	let wishlist_obj = {
		_id: parsedGameId,
		title: game.title
	}

	const userCollection = await users();
	const updateInfo = await userCollection.updateOne(
        { _id: parsedUserId },
        { $addToSet: { wishlist: wishlist_obj } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Failed to add game to likes.';
	return await getUserById(userId);
}

/**
 * Removes a game id from a user's liked list
 * @param {*} userId 
 * @param {*} gameId 
 * @returns 
 */
 async function removeLikedGame(userId, gameId) {
	// Check userId
	if (!userId) throw "You must provide an user id";
    if (typeof userId !== "string") throw "The provided user id must be a string";
    if (userId.trim().length === 0) throw "The provided user id must not be an empty string";

	// Check gameId
	if (!gameId) throw "You must provide a game id";
    if (typeof gameId !== "string") throw "The provided game id must be a string";
    if (gameId.trim().length === 0) throw "The provided game id must not be an empty string";

	let user;
	// Check to make sure user with the userId exists
	try {
		user = await getUserById(userId);
	} catch (e) {
		throw `User with id ${userId} does not exist.`
	}

	// Check to make sure that a game with the gameId exists
	try {
		let game = await gamesData.getGameById(gameId);
	} catch (e) {
		throw `Game with id ${gameId} does not exist.`
	}

	// Check if game has already been added to likes list
	let x = false;
	for (let y of user.likes) {
		if (y._id.toString() === gameId) {
			x = true;
			break;
		}
	}
	if (x == false) throw `Game with id ${gameId} is not a part of user's liked list.`;

	let parsedUserId = ObjectId(userId);
	let parsedGameId = ObjectId(gameId);

	const userCollection = await users();
	const updateInfo = await userCollection.updateOne(
        { _id: parsedUserId },
        { $pull: { likes: { _id: parsedGameId } } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Failed to remove game from likes.';
	return await getUserById(userId);
}

<<<<<<< HEAD

/**
 * Adds a game id to a user's liked list
 * @param {*} userId
 * @param {*} gameId
 * @returns
 */
async function addLikedReview(userId, gameId,reviewId) {
	// Check userId
	if (!userId) throw "You must provide an user id";
    if (typeof userId !== "string") throw "The provided user id must be a string";
    if (userId.trim().length === 0) throw "The provided user id must not be an empty string";

	// Check gameId
	if (!gameId) throw "You must provide a game id";
    if (typeof gameId !== "string") throw "The provided game id must be a string";
    if (gameId.trim().length === 0) throw "The provided game id must not be an empty string";

    // Check gameId
	if (!reviewId) throw "You must provide a review id";
    if (typeof reviewId !== "string") throw "The provided review id must be a string";
    if (reviewId.trim().length === 0) throw "The provided review id must not be an empty string";


	let user;
	// Check to make sure user with the userId exists
	try {
		user = await getUserById(userId);
	} catch (e) {
		throw `User with id ${userId} does not exist.`
	}

	// Check to make sure that a game with the gameId exists
	let game;
	try {
		game = await gamesData.getGameById(gameId);
	} catch (e) {
		throw `Game with id ${gameId} does not exist.`
	}

	// Check if game has already been added to likes list
	for (let x of user.reviewLikes) {
		if (x.gameId.toString() === gameId && x.reviewId.toString() == reviewId) {
			throw `User has already liked the review with id of ${reviewId}`;
		}
	}

	let parsedUserId = ObjectId(userId);
	let parsedGameId = ObjectId(gameId);
    let parsedReviewId = ObjectId(reviewId);

	let liked_obj = {
		gameId: parsedGameId,
        reviewId: parsedReviewId,
		title: game.title
	}

	const userCollection = await users();
	const updateInfo = await userCollection.updateOne(
        { _id: parsedUserId },
        { $addToSet: { reviewLikes: liked_obj } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Failed to add game to likes.';
	return await getUserById(userId);
}



/**
 * Adds a game id to a user's liked list
 * @param {*} userId
 * @param {*} gameId
 * @returns
 */
async function addDislikedReview(userId, gameId,reviewId) {
	// Check userId
	if (!userId) throw "You must provide an user id";
    if (typeof userId !== "string") throw "The provided user id must be a string";
    if (userId.trim().length === 0) throw "The provided user id must not be an empty string";

	// Check gameId
	if (!gameId) throw "You must provide a game id";
    if (typeof gameId !== "string") throw "The provided game id must be a string";
    if (gameId.trim().length === 0) throw "The provided game id must not be an empty string";

    // Check gameId
	if (!reviewId) throw "You must provide a review id";
    if (typeof reviewId !== "string") throw "The provided review id must be a string";
    if (reviewId.trim().length === 0) throw "The provided review id must not be an empty string";


	let user;
	// Check to make sure user with the userId exists
	try {
		user = await getUserById(userId);
	} catch (e) {
		throw `User with id ${userId} does not exist.`
	}

	// Check to make sure that a game with the gameId exists
	let game;
	try {
		game = await gamesData.getGameById(gameId);
	} catch (e) {
		throw `Game with id ${gameId} does not exist.`
	}

	//Check if game has already been added to dislikes list so that it can be removed
	for (let x of user.reviewLikes) {
		if (x.gameId.toString() === gameId && x.reviewId.toString() == reviewId) {
			throw `User has already disliked the review with id of ${reviewId}`;
		}
	}

	let parsedUserId = ObjectId(userId);
	let parsedGameId = ObjectId(gameId);
    let parsedReviewId = ObjectId(reviewId);

	let liked_obj = {
		gameId: parsedGameId,
        reviewId: parsedReviewId,
		title: game.title
	}

	const userCollection = await users();
	const updateInfo = await userCollection.updateOne(
        { _id: parsedUserId },
        { $addToSet: { reviewDislikes: liked_obj } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Failed to add game to likes.';
	return await getUserById(userId);
}




/**
 * Removes a game id from a user's liked list
 * @param {*} userId
 * @param {*} gameId
 * @returns
 */
 async function removeLikedReview(userId, gameId,reviewId) {
=======
/**
 * Removes a game id from a user's liked list
 * @param {*} userId 
 * @param {*} gameId 
 * @returns 
 */
 async function removeWishlistedGame(userId, gameId) {
>>>>>>> origin
	// Check userId
	if (!userId) throw "You must provide an user id";
    if (typeof userId !== "string") throw "The provided user id must be a string";
    if (userId.trim().length === 0) throw "The provided user id must not be an empty string";

	// Check gameId
	if (!gameId) throw "You must provide a game id";
    if (typeof gameId !== "string") throw "The provided game id must be a string";
    if (gameId.trim().length === 0) throw "The provided game id must not be an empty string";

<<<<<<< HEAD

    // Check reviewId
	if (!gameId) throw "You must provide a review id";
    if (typeof gameId !== "string") throw "The provided review id must be a string";
    if (gameId.trim().length === 0) throw "The provided review id must not be an empty string";


=======
>>>>>>> origin
	let user;
	// Check to make sure user with the userId exists
	try {
		user = await getUserById(userId);
	} catch (e) {
		throw `User with id ${userId} does not exist.`
	}

	// Check to make sure that a game with the gameId exists
	try {
		let game = await gamesData.getGameById(gameId);
	} catch (e) {
		throw `Game with id ${gameId} does not exist.`
	}

<<<<<<< HEAD
	// Check if review has already been added to likes list
	let x = false;
	for (let y of user.reviewLikes) {
		if (y.gameId.toString() === gameId && y.reviewId.toString() === reviewId) {
			x = true;
			break;
		}
	}
	if (x == false) throw `Review with id ${reviewId} is not a part of user's liked list.`;

	let parsedUserId = ObjectId(userId);
    let parsedReviewId = ObjectId(reviewId);
	// let parsedGameId = ObjectId(gameId);

	const userCollection = await users();
	const updateInfo = await userCollection.updateOne(
        { _id: parsedUserId },
        { $pull: { reviewLikes: {reviewId: parsedReviewId} } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Failed to remove game from likes.';
	return await getUserById(userId);
}

/**
 * Removes a game id from a user's liked list
 * @param {*} userId
 * @param {*} gameId
 * @returns
 */
 async function removeDislikedReview(userId, gameId,reviewId) {
	// Check userId
	if (!userId) throw "You must provide an user id";
    if (typeof userId !== "string") throw "The provided user id must be a string";
    if (userId.trim().length === 0) throw "The provided user id must not be an empty string";

	// Check gameId
	if (!gameId) throw "You must provide a game id";
    if (typeof gameId !== "string") throw "The provided game id must be a string";
    if (gameId.trim().length === 0) throw "The provided game id must not be an empty string";


    // Check reviewId
	if (!gameId) throw "You must provide a review id";
    if (typeof gameId !== "string") throw "The provided review id must be a string";
    if (gameId.trim().length === 0) throw "The provided review id must not be an empty string";


	let user;
	// Check to make sure user with the userId exists
	try {
		user = await getUserById(userId);
	} catch (e) {
		throw `User with id ${userId} does not exist.`
	}

	// Check to make sure that a game with the gameId exists
	try {
		let game = await gamesData.getGameById(gameId);
	} catch (e) {
		throw `Game with id ${gameId} does not exist.`
	}

	// Check if review has already been added to dislikes list so that it can be removed
 	let x = false;
	for (let y of user.reviewDislikes) {
		if (y.gameId.toString() === gameId && y.reviewId.toString() === reviewId) {
=======
	// Check if game has already been added to wish list
	let x = false;
	for (let y of user.wishlist) {
		if (y._id.toString() === gameId) {
>>>>>>> origin
			x = true;
			break;
		}
	}
<<<<<<< HEAD
	if (x == false) throw `Review with id ${reviewId} is not a part of user's liked list.`;

	let parsedUserId = ObjectId(userId);
    let parsedReviewId = ObjectId(reviewId);
	// let parsedGameId = ObjectId(gameId);
=======
	if (x == false) throw `Game with id ${gameId} is not a part of user's wish list.`;

	let parsedUserId = ObjectId(userId);
	let parsedGameId = ObjectId(gameId);
>>>>>>> origin

	const userCollection = await users();
	const updateInfo = await userCollection.updateOne(
        { _id: parsedUserId },
<<<<<<< HEAD
        { $pull: { reviewDislikes: {reviewId: parsedReviewId} } }
=======
        { $pull: { wishlist: { _id: parsedGameId } } }
>>>>>>> origin
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Failed to remove game from likes.';
	return await getUserById(userId);
}

<<<<<<< HEAD






=======
>>>>>>> origin
 module.exports = {
	 createUser,
	 getAllUsers,
	 getUserById,
	 getUserByUsername,
  //   updateUsername,
	 updateFirstName,
	 updateLastName,
	 updateEmail,
	 updatePassword,
	 updateLikes,
	 updateFollows,
	 updateWishlist,
	 updateReviews,
	 removeUserById,
	 usernameCheck,
	 addLikedGame,
<<<<<<< HEAD
	 removeLikedGame,
     addLikedReview,
     removeLikedReview,
     addDislikedReview,
     removeDislikedReview
 };
=======
	 addWishlistGame,
	 removeLikedGame,
	 removeWishlistedGame
 };
>>>>>>> origin
