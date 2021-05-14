/*
* To check inputs of the reply form, before submission.
*/

(function(){
$("#reply-form").submit(function(event) {
    event.preventDefault();

    $(".reviewErrors").empty();
    $("#replyError").empty();
    $("#replyError").hide();

    let body = $("#replyBody").val().trim();
    let error = false;
    let message = null;
    let id = $(".gameId").attr("value");
    let reviewId = $(".reviewId").attr("value");
    // Console.log(id);
    // console.log(reviewId);;
    if (!body){
        error = true;
        message = "Error: Reply is empty."
    }

    if (error){
        event.preventDefault();
        let htmlStr = `<p class="reviewErrors">${message}</p>`;
        $("#replyError").append(htmlStr);
        $("#replyError").show();
    }

    // if(body){
        let requestConfig = {
            method: 'GET',
            url: `/games/${id}/review/${reviewId}/replies`,
            contentType: 'application/json',
        }
       
        $.ajax(requestConfig).then(function(responseMessage) {
			console.log(responseMessage);
		});
    // }
                    
})
   
})();
