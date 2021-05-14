/*
* To check inputs of the review form, before submission.
*/
(function($) {

    $("#review-form").submit(function(event) {
    
        $("#reviewList").empty();
        $("#reviewError").empty();
        $("#reviewError").hide();
    
        let title = $("#reviewTitle").val().trim();
        let rating = $("#reviewRating").val();
        let review = $("#reviewBody").val().trim();
    
        let parsedRating = parseInt(rating);

        let error = false;
        let message = null;
    
    
        if (!error && (!title || !rating || !review)){
            error = true;
            message = "Error: Title, rating or review is missing."
        }
    
        if (!error && ( parsedRating < 1 || parsedRating > 5)){
            error = true;
            message = "Error: The rating should between 1 and 5."
        }
    
    
        if (error){
            event.preventDefault();
            let htmlStr = `<p class="reviewErrors">${message}</p>`;
            $("#reviewError").append(htmlStr);
            $("#reviewError").show();
        }
    
    })
})(jQuery);