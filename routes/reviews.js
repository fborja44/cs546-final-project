const express = require('express');
const router = express.Router();
const data = require('../data/');
const path = require('path');
const xss = require('xss');
const reviewsData = data.reviews;
const gamesData = data.games;

router.get('/:id/:reviewId', async (req, res) => {
    // Parse the game and review id
    let gameId = req.params.id;
    let reviewId = req.params.reviewId;
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
  let gameId = req.params.id;

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1); //January is 0!
  var yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' + yyyy;

  //let reviewPost = xss(req.body);
  let reviewPost = req.body;
  let errors = [];

  if (!gameId || gameId.trim().length === 0) {
      errors.push('Missing id.');
  }

  let game = await gamesData.getGameByTitle(reviewPost.gameTitle);


  if (!reviewPost.reviewTitle || reviewPost.reviewTitle.trim().length===0) {
    errors.push('No title provided');
  }

  if(reviewPost.reviewTitle.length > 85){
    errors.push("Title can't exceed 85 characters.");
  }
  if (!reviewPost.reviewBody || reviewPost.reviewBody.trim().length===0) {
    errors.push('No body provided');
  }

  if (reviewPost.reviewBody.length >125) {
    errors.push("Body can't exceed 125 characters.");
  }


  if (!reviewPost.reviewRating) {
    errors.push('No rating provided');
  }

  if (errors.length > 0) {
      res.render('games/single', {
          title:game.title,
          game:game,
          errors: errors,
          hasErrors: true
      });
      return;
  }

  try {
    const newReview = await reviewsData.createReview(
      game._id,
      xss(reviewPost.reviewTitle),
      {username:"idk",_id: "234982374"},
      today.toString(),
      xss(reviewPost.reviewBody),
       5)
      res.redirect(`/games/${game._id}`);

  }catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
});

module.exports = router;
