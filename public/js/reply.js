/*
* To check inputs of the reply form, before submission.
*/

$("#reply-form").submit(function(event) {

    $(".reviewErrors").empty();
    $("#replyError").empty();
    $("#replyError").hide();

    let body = $("#replyBody").val().trim();

    let error = false;
    let message = null;

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

})