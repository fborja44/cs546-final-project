(function ($) {
  $("#login-form").submit(function(event) {

    $("#loginError").empty();
    $("#loginError").hide();

    let username = $("#username").val().trim();
    let password = $("#password").val().trim();

    let error = false;
    let message = null;

    if (!username || !password){
        error = true;
        message = "Error: Missing username or password."
    }

    if (!error && (password.length < 4 || password.length > 20)){
        error = true;
        message = "Error: The length of password should between 4 and 20."
    }

    if (error){
        event.preventDefault();
        let htmlStr = `<p class = "signError">${message}</p>`
        $("#loginError").append(htmlStr);
        $("#loginError").show();
    }


})

  })(jQuery); // jQuery is exported as $ and jQuery