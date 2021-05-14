/*
* To check inputs of the editReview form, before submission.
*/

(function($)
    {

        $("#editReview-form").submit(function(event) {

        $(".reviewErrors").empty();
        $("#editReviewError").empty();
        $("#editReviewError").hide();
    
        let title = $("#reviewTitle").val().trim();
        let rating = $("#reviewRating").val();
        let review = $("#reviewBody").val().trim();
    
        let parseRating = parseInt(rating);

        let error = false;
        let message = null;
    
    
        if (!error && (!title || !rating || !review)){
            error = true;
            message = "Error: Title, rating or review is missing."
        }

        if (!error && title.length >= 50) {
            error = true;
            message = "Error: The title must be less than 50 characters";
        }
    
        if (!error && ( parseRating < 1 || parseRating > 5)){
            error = true;
            message = "Error: The rating should between 1 and 5."
        }

    
        if (error){
            event.preventDefault();
            let htmlStr = `<p class="reviewErrors">${message}</p>`;
            $("#editReviewError").append(htmlStr);
            $("#editReviewError").show();
        }
    
    })
 }
)(window.jQuery);
