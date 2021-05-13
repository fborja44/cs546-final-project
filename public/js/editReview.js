/*
* To check inputs of the editReview form, before submission.
*/

$("#editReview-form").submit(function(event) {

        $(".reviewErrors").empty();
        $("#editReviewError").empty();
        $("#editReviewError").hide();
    
        let title = $("#reviewTitle").val().trim();
        let rating = $("#reviewRating").val();
        let review = $("#reviewBody").val().trim();
    
        
        let error = false;
        let message = null;
    
    
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
            let htmlStr = `<p class="reviewErrors">${message}</p>`;
            $("#editReviewError").append(htmlStr);
            $("#editReviewError").show();
        }
    
    })