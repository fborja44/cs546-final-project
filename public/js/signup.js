
/*
* To check inputs of the sign up form, before submission.
*/

$("#signup-form").submit(function(event) {

    $("#signupError").empty();
    $("#signupError").hide();

    let username = $("#signup-username").val().trim();
    let password = $("#signup-password").val().trim();
    let email = $("#signup-email").val().trim();
    let firstName = $("#firstName").val().trim();
    let lastName = $("#lastName").val().trim();

    let error = false;
    let message = null;

    if (!username || !password || !email || !firstName || !lastName){
        error = true;
        message = "Error: All feilds should be supplied."
    }

    if (!error && (password.length < 4 || password.length > 10)){
        error = true;
        message = "Error: The length of password should between 4 and 10."
    }

    const emailPattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (!error && !emailPattern.test(email)){
        error = true;
        message = "Error: Invaild email address."
    }

    if (error){
        event.preventDefault();
        let htmlStr = `<p class = "signError">${message}</p>`
        $("#signupError").append(htmlStr);
        $("#signupError").show();
    }

})

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

    if (!error && (password.length < 4 || password.length > 10)){
        error = true;
        message = "Error: The length of password should between 4 and 10."
    }

    if (error){
        event.preventDefault();
        let htmlStr = `<p class = "signError">${message}</p>`
        $("#loginError").append(htmlStr);
        $("#loginError").show();
    }

})