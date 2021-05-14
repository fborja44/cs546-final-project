
/*
* To check inputs of the sign up form, before submission.
*/
(function ($) {
    $("#signup-form").submit(function(event) {

        $("#signupError").empty();
        $("#signupError").hide();

        let username = $("#signup_username").val().trim();
        let password = $("#signup_password").val().trim();
        let email = $("#signup_email").val().trim();
        let firstName = $("#firstName").val().trim();
        let lastName = $("#lastName").val().trim();

        let error = false;
        let message = null;

        if (!username || !password || !email || !firstName || !lastName){
            error = true;
            message = "Error: All fields should be supplied."
        }

        if (!error && (password.length < 4 || password.length > 20)){
            error = true;
            message = "Error: The length of password should between 4 and 20."
        }

        const emailPattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (!error && !emailPattern.test(email)){
            error = true;
            message = "Error: Invaild email address."
        }

        console.log(error);

        if (error){
            event.preventDefault();
            let htmlStr = `<p class = "signError">${message}</p>`
            $("#signupError").append(htmlStr);
            $("#signupError").show();
        }

    })
})(jQuery);


// $("#login-form").submit(function(event) {

//     $("#loginError").empty();
//     $("#loginError").hide();

//     let username = $("#username").val().trim();
//     let password = $("#password").val().trim();

//     let error = false;
//     let message = null;

//     if (!username || !password){
//         error = true;
//         message = "Error: Missing username or password."
//     }

//     if (!error && (password.length < 4 || password.length > 20)){
//         error = true;
//         message = "Error: The length of password should between 4 and 20."
//     }

//     if (error){
//         event.preventDefault();
//         let htmlStr = `<p class = "signError">${message}</p>`
//         $("#loginError").append(htmlStr);
//         $("#loginError").show();
//     }


// })
