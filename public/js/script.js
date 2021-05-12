/* Methods for calculations
 ---------------------------------------------------------------------------*/
/**
 * Update a game's rating background color based on the score and add a decimal 
 * if it is missing
 */
let ratings = document.getElementsByClassName("score");
for (let i = 0; i < ratings.length; i++) {
    let rating = ratings[i].firstElementChild.innerHTML;
    // ugly way of adding .0 to the end
    if (rating.length === 1) {
        ratings[i].firstElementChild.innerHTML = ratings[i].firstElementChild.innerHTML + ".0";
    }
    if (rating >= 4.2) { // Best Ratings
        ratings[i].style.background = "#00D46E";
    } else if (4.2 > rating && rating >= 3.4) { // High Ratings
        ratings[i].style.background = "#B7D400";
    } else if (3.4 > rating && rating >= 2.6) { // Medium Ratings
        ratings[i].style.background = "#FBD927";
    } else if (2.6 > rating && rating >= 1.8) { // Low Ratings
        ratings[i].style.background = "#FB9927";
    } else if (1.8 > rating && rating >= 1) { // Poor Ratings
        ratings[i].style.background = "#FB4027";
    } else if (rating == "0" || rating === "N/A") {
        ratings[i].firstElementChild.innerHTML = "N/A";
        ratings[i].style.color = "white";
        ratings[i].style.background = "black";
    } else {
        ratings[i].firstElementChild.innerHTML = "N/A";
        ratings[i].style.color = "white";
        ratings[i].style.background = "black";
    }
}

/**
 * Do the same for review scores
 */
ratings = document.getElementsByClassName("review-rating");
for (let i = 0; i < ratings.length; i++) {
    let rating = ratings[i].firstElementChild.innerHTML;
    if (rating == 5) { 
        ratings[i].style.background = "#00D46E";
    } else if (rating == 4) {
        ratings[i].style.background = "#B7D400";
    } else if (rating == 3) {
        ratings[i].style.background = "#FBD927";
    } else if (rating == 2) {
        ratings[i].style.background = "#FB9927";
    } else if (rating == 1) {
        ratings[i].style.background = "#FB4027";
    } else if (rating == "0" || rating === "N/A") {
        ratings[i].firstElementChild.innerHTML = "N/A";
        ratings[i].style.color = "white";
        ratings[i].style.background = "black";
    } else {
        ratings[i].firstElementChild.innerHTML = "N/A";
        ratings[i].style.color = "white";
        ratings[i].style.background = "black";
    }
}