/* Methods for calculations
 ---------------------------------------------------------------------------*/
/**
 * Update a game's rating background color based on the score and add a decimal 
 * if it is missing
 */
let ratings = document.getElementsByClassName("score");
for (let i = 0; i < ratings.length; i++) {
    let rating = ratings[i].firstElementChild.innerHTML;
    // janky way of adding .0 to the end
    if (rating.length === 1) {
        ratings[i].firstElementChild.innerHTML = ratings[i].firstElementChild.innerHTML + ".0";
    }
    if (rating >= 4) {
        ratings[i].style.background = "#2FE58E";
    } else if (4 > rating && rating >= 2) {
        ratings[i].style.background = "#FBD927";
    } else if (2 > rating && rating >= 0) {
        ratings[i].style.background = "#FB4027";
    }
}

/**
 * Do the same for review scores
 */
ratings = document.getElementsByClassName("review-rating");
for (let i = 0; i < ratings.length; i++) {
    let rating = ratings[i].firstElementChild.innerHTML;
    if (rating >= 4) {
        ratings[i].style.background = "#2FE58E";
    } else if (4 > rating && rating >= 2) {
        ratings[i].style.background = "#FBD927";
    } else if (2 > rating && rating >= 0) {
        ratings[i].style.background = "#FB4027";
    }
}
