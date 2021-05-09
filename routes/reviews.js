const express = require('express');
const router = express.Router();
const data = require('../data/');
const path = require('path');
const xss = require('xss');
const reviewsData = data.reviews;
const gamesData = data.games;

router.post('/', async (req, res) => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1); //January is 0!
  var yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' + yyyy;

  let reviewPost = xss(req.body);
  let errors = [];
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
      reviewPost.reviewTitle,
      {username:"idk",_id: "234982374"},
      today.toString(),
      reviewPost.reviewBody,
      parseInt(reviewPost.reviewRating)
    )
      res.redirect(`/games/${game.title}`);

  }catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
});

module.exports = router;
