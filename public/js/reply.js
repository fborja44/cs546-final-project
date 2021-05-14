/*
* To check inputs of the reply form, before submission.
*/

(function($){
    $("#reply-form").submit(function(event) {
        event.preventDefault();
        $(".reviewErrors").empty();
        $("#replyError").empty();
        $("#replyError").hide();

        let body = $("#replyBody").val().trim();
        let id = $(".gameId").attr("value");
        let reviewId = $(".reviewId").attr("value");
        let error = false;
        let message = null;
        let replyHtml = $("#replyResponse");

        let empty = $("#empty");

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
            return;
        }
  
        let requestConfig = {
                   method: 'POST',
                   url: `/games/${id}/review/${reviewId}`,
                   contentType: 'application/json',
                   data: JSON.stringify({
                        replyBody:body
                    })
            };
              
               $.ajax(requestConfig).then(function(responseMessage) {
                  if (responseMessage.reply) {
                      empty.hide();
                       console.log("this is the response  message");
                       console.log(responseMessage.reply);
                       let div = $(`<div class="review"></div>`)
                       let reviewH = $(`<div class="review-heading"> </div>`);
                       replyHtml.append(div);
                       div.append(reviewH);
                       reviewH.append(`<img class="profile-pic" src="/public/img/default_user.jpg" alt="profile pic">`);
                       reviewH.append(`<h2>Author: ${responseMessage.reply.username}</h2>`)
                       div.append(`<p>Date: ${responseMessage.reply.replyDate}</p>`);
                       div.append(`<p>Reply: ${responseMessage.reply.reply}</p>`)
                  } else {
                      event.preventDefault();
                      let htmlStr = `<p class="reviewErrors">Error: Must be logged in</p>`
                      $("#replyError").append(htmlStr);
                      $("#replyError").show();
                  }


               });
       

    })
})(jQuery);
