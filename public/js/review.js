$("#review-form").submit(function(event) {

    $("#reviewList").empty();
    $("#reviewError").empty();
    $("#reviewError").hide();

    let gameTitle = $("#reviewTitle").val().trim();
    let gameId = $("#reviewTitle").val().trim();
    let title = $("#reviewTitle").val().trim();
    let rating = $("#reviewRating").val();
    let review = $("#reviewBody").val().trim();

    
    let error = false;
    let message = null;

    if(!gameTitle || !gameId){
        error = true;
        message = "Emmm... it is interesting... No title."
    }

    if (!error && (!title || !rating || !review)){
        error = true;
        message = "Error: Title, rating or review is missing."
    }

    if (!error && ( rating < 1 || rating > 5)){
        error = true;
        message = "Error: The rating should between 1 and 5."
    }


    if (error){
        event.preventDefault();
        let htmlStr = `<p class = "reviewErrors">${message}</p>`;
        $("#reviewError").append(htmlStr);
        $("#reviewError").show();
    }

})