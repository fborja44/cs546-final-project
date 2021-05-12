const express = require('express');
const router = express.Router();
const data = require('../data/');
const path = require('path');
const xss = require('xss');
const reviewsData = data.reviews;
const gamesData = data.games;
const usersData = data.users;

router.get('/:id/:reviewId', async (req, res) => {
    // Parse the game and review id
    let gameId = xss(req.params.id);
    let reviewId = xss(req.params.reviewId);
    let errors = [];

    if (!gameId || gameId.trim().length === 0) {
        errors.push('Missing id.');
    }

    if (!reviewId || reviewId.trim().length === 0) {
        errors.push('Missing id.');
    }

    if (errors.length > 0) {
        // console.log("error.");
        res.status(404).json({messge: errors})
        return;
    }

    // Check if game exists with gameId
    let game;
    try {
        game = await gamesData.getGameById(gameId);
    } catch (e) {
        res.status(404).json({message: e}); // CHANGE THIS
        return;
    }

    // Check if review exists with reviewId
    let review;
    try {
        review = await reviewsData.getReviewById(gameId, reviewId);
    } catch (e) {
        res.status(404).json({message: e}); // CHANGE THIS
        return;
    }

    try {
        res.render('games/review', { title: "VGReviews", game: game, review: review , repliesEmpty: review.replies.length === 0, signed_in: req.body.signed_in, partial:'gameList'});
    } catch (e) {
        res.status(500).json({message: e});
    }
});

router.post('/:gameId', async (req, res) => {
    let gameId = xss(req.params.gameId);
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;

    let reviewPost = req.body;
    let errors = [];

    if (!gameId || gameId.trim().length === 0) {
        errors.push('Missing id.');
    }

    let game = await gamesData.getGameByTitle(reviewPost.gameTitle);

      // Make sure user is authenticated
    if (!req.session.user_id) {
        // User is not authenticated
        errors.push("You must login to like a review.");
    }

    if (!reviewPost.reviewTitle || reviewPost.reviewTitle.trim().length===0) {
        errors.push('No title provided');
    }

    if(reviewPost.reviewTitle.length > 85){
        errors.push("Title can't exceed over 85 characters.");
    }
    if (!reviewPost.reviewBody || reviewPost.reviewBody.trim().length===0) {
        errors.push('No body provided');
    }

    if (reviewPost.reviewBody.length > 125) {
        errors.push("Body can't exceed over 125 characters.");
    }


    if (!reviewPost.reviewRating) {
      errors.push('No rating provided');
    }

    if (errors.length > 0) {
        res.render('games/single', {
            title:game.title,
            game:game,
            errors: errors,
            hasErrors: true,
            partial: 'gameList'
        });
        return;
    }

    let user;
    try {
        user = await usersData.getUserById(req.session.user_id);
    } catch (e) {
        return res.status(404).json({message: e});
    }

    try {
        const newReview = await reviewsData.createReview(
          game._id,
          xss(reviewPost.reviewTitle),
          {username:user.username,_id:user._id},
          today.toString(),
          xss(reviewPost.reviewBody),
          parseInt(xss(reviewPost.reviewRating))
        )
          //adding the newly written review to the users database
        user.reviews.push(newReview);
        await usersData.updateReviews(user._id,user.reviews);
        return res.redirect(`/games/${game._id}`);

    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: e });
    }
});


/**
 * increases the review's like count.
 */
router.post('/:gameId/:reviewId/like', async (req, res) => {
    // Parse the game id
   console.log("in Likes");
   let reviewId = req.params.reviewId;
   let gameId = req.params.gameId;
    //let body = req.body;
    let errors = [];

   if (!reviewId || reviewId.trim().length === 0) {
     errors.push('Missing reviewId.');
   }

   if (!gameId || gameId.trim().length === 0) {
     errors.push('Missing gameId.');
   }


    if (errors.length > 0) {
        res.status(404).json({message: e}); // CHANGE THIS
        return;
    }

    // Check if game exists with id
    try {
        let game = await gamesData.getGameById(gameId);
    } catch (e) {
        res.status(404).json({message: e}); // CHANGE THIS
    }

    // Make sure user is authenticated
    if (!req.session.user_id) {
        // User is not authenticated
        console.log("You must login to like a review."); // CHANGE THIS
        return res.redirect(`/games/${gameId}`);
    }

    // Check if game is already in the user's liked list
    // If it isn't, then add it and increment like count
    // If it's not, then remove it and decrement the like count
   let user;
	 try {
	   user = await usersData.getUserById(req.session.user_id);
	 } catch (e) {
	   return res.status(404).json({message: e});
	 }
   let liked = false;
   for (let reviewInfo of user.reviewLikes) {
	   if (reviewInfo.gameId.toString() == gameId && reviewInfo.reviewId.toString() == reviewId) {
        liked = true;
	   }
	 }

   let dislike = false;
   for (let reviewInfo of user.reviewDislikes) {
	   if (reviewInfo.gameId.toString() == gameId && reviewInfo.reviewId.toString() == reviewId) {
        dislike = true;
	   }
	 }

   if(liked == false && dislike == true){
      try {
            await usersData.removeDislikedReview(req.session.user_id,gameId,reviewId);
        } catch (e) {
            return res.status(500).json({message: e});
        }

       // decrement game's dislike count
        try {
            await reviewsData.decrementDislike(gameId, reviewId);
            await reviewsData.getReviewById(gameId,reviewId);
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: e});
        }

     try {
            await usersData.addLikedReview(req.session.user_id,gameId,reviewId)
        } catch (e) {
            return res.status(500).json({message: e});
        }

        // Increment game's like count
        try {
            await reviewsData.incrementLike(gameId,reviewId);
            return res.redirect(`/games/${gameId}`);
        } catch (e) {
            return res.status(500).json({message: e});
        }
   }else{

    if (liked) { // Game is already liked; remove
        try {
            await usersData.removeLikedReview(req.session.user_id,gameId,reviewId);
        } catch (e) {
            return res.status(500).json({message: e});
        }

        // decrement game's like count
        try {
            await reviewsData.decrementLike(gameId, reviewId);
            await reviewsData.getReviewById(gameId,reviewId);
            return res.redirect(`/games/${gameId}`);
        } catch (e) {
            return res.status(500).json({message: e});
        }

    } else { // Game is not liked; add
        // Try to add the game to the user's liked list
        try {
          await usersData.addLikedReview(req.session.user_id,gameId,reviewId)
        } catch (e) {
            return res.status(500).json({message: e});
        }

        // Increment game's like count
        try {
            await reviewsData.incrementLike(gameId,reviewId);
            return res.redirect(`/games/${gameId}`);
        } catch (e) {
            return res.status(500).json({message: e});
        }
    }
   }

});


/**
 * increases the review's like count.
 */
 router.post('/:gameId/:reviewId/dislike', async (req, res) => {
    // Parse the game id
   let reviewId = req.params.reviewId;
   let gameId = req.params.gameId;
    //let body = req.body;
    let errors = [];

   if (!reviewId || reviewId.trim().length === 0) {
     errors.push('Missing reviewId.');
   }

   if (!gameId || gameId.trim().length === 0) {
     errors.push('Missing gameId.');
   }


    if (errors.length > 0) {
        res.status(404).json({message: e}); // CHANGE THIS
        return;
    }

    // Check if game exists with id
    try {
        let game = await gamesData.getGameById(gameId);
    } catch (e) {
        res.status(404).json({message: e}); // CHANGE THIS
    }

    // Make sure user is authenticated
    if (!req.session.user_id) {
        // User is not authenticated
        console.log("You must login to dislike a game."); // CHANGE THIS
        return res.redirect(`/games/${gameId}`);
    }

    // Check if game is already in the user's liked list
    // If it isn't, then add it and increment like count
    // If it's not, then remove it and decrement the like count
   let user;
	 try {
	   user = await usersData.getUserById(req.session.user_id);
	 } catch (e) {
	   return res.status(404).json({message: e});
	 }
   let disliked = false;
   for (let reviewInfo of user.reviewDislikes) {
	   if (reviewInfo.gameId.toString() == gameId && reviewInfo.reviewId.toString() == reviewId) {
        disliked = true;
	   }
	 }

   let liked = false;
   for (let reviewInfo of user.reviewLikes) {
	   if (reviewInfo.gameId.toString() == gameId && reviewInfo.reviewId.toString() == reviewId) {
        liked = true;
	   }
	 }

    if(disliked == false && liked == true){
    
      try{
          await usersData.removeLikedReview(req.session.user_id,gameId,reviewId);
      } catch (e) {
        return res.status(500).json({message: e});
      }

   // decrement game's like count
      try {
        await reviewsData.decrementLike(gameId, reviewId);
        await reviewsData.getReviewById(gameId,reviewId);
      } catch (e) {
        return res.status(500).json({message: e});
      }

      try {
        await usersData.addDislikedReview(req.session.user_id,gameId,reviewId)
      } catch (e) {
        return res.status(500).json({message: e});
      }

        // Increment game's dislike count
      try {
        await reviewsData.incrementDislike(gameId,reviewId);
        return res.redirect(`/games/${gameId}`);
      } catch (e) {
        return res.status(500).json({message: e});
      }

   }
   else{ if (disliked) { // Game is already liked; remove
        try {
            await usersData.removeDislikedReview(req.session.user_id,gameId,reviewId);

        } catch (e) {
            return res.status(500).json({message: e});
        }

       // decrement game's dislike count
        try {
            await reviewsData.decrementDislike(gameId, reviewId);
            await reviewsData.getReviewById(gameId,reviewId);
            return res.redirect(`/games/${gameId}`);
        } catch (e) {
            return res.status(500).json({message: e});
        }

    } else { // Game is not liked; add
        // Try to add the game to the user's liked list
        try {
          await usersData.addDislikedReview(req.session.user_id,gameId,reviewId)

        } catch (e) {
            return res.status(500).json({message: e});
        }

        // Increment game's dislike count
        try {
            await reviewsData.incrementDislike(gameId,reviewId);
            return res.redirect(`/games/${gameId}`);
        } catch (e) {
            return res.status(500).json({message: e});
        }
    }
  }

});

module.exports = router;
