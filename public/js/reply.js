/*
* To check inputs of the reply form, before submission.
*/

(function($){
    $("#reply-form").submit(function(event) {

        $(".reviewErrors").empty();
        $("#replyError").empty();
        $("#replyError").hide();

        let body = $("#replyBody").val().trim();
        let id = $(".gameId").attr("value");
        let reviewId = $(".reviewId").attr("value");
        let error = false;
        let message = null;

        if (!body){
            error = true;
            message = "Error: Reply is empty."
        }

        if (body.length >= 1000) {
            error = true;
            message = "Error: Body must be less than 1000 characters";
        }


        if (error){
            event.preventDefault();
            let htmlStr = `<p class="reviewErrors">${message}</p>`;
            $("#replyError").append(htmlStr);
            $("#replyError").show();
        }
  
        let requestConfig = {
                   method: 'GET',
                   url: `/games/${id}/review/${reviewId}/replies`,
                   contentType: 'application/json',
               }
              
               $.ajax(requestConfig).then(function(responseMessage) {
                   console.log(responseMessage);
               });
       

    })
})(jQuery);
