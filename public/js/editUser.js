$("#edit-form").submit(function(event) {

    $("#editError").empty();
    $("#editError").hide();

    let password = $("#editpassword").val().trim();
    let email = $("#editemail").val().trim();
    let firstName = $("#editfirstName").val().trim();
    let lastName = $("#editlastName").val().trim();

    let error = false;
    let message = null;

    if (!password && !email && !firstName && !lastName){
        error = true;
        message = "Error: Nothing will be changed."
    }

    if (password && !error && (password.length < 4 || password.length > 20)){
        error = true;
        message = "Error: The length of password should between 4 and 20."
    }

    const emailPattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (email && !error && !emailPattern.test(email)){
        error = true;
        message = "Error: Invaild email address."
    }

    if (error){
        event.preventDefault();
        let htmlStr = `<p class = "signError">${message}</p>`
        $("#editError").append(htmlStr);
        $("#editpError").show();
    }

})