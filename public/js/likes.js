(function($) {
    let games = $(".games");
    // let game1 = $("#609710ca0693174a84677419");
    // console.log(game1.find("form").find("like-form"));
    // let like_forms = $(".like-form");
    // console.log(like_forms);

    // Onload, check if a game is liked. If it is, then change the icon to filled
    for (let i = 0; i < games.length; i++) {
        let game = games.eq(i)
        let id = game.attr('id');
        let requestConfig = {
            method: 'GET',
            url: `/games/like/${id}`,
            contentType: 'application/json',
        }
        $.ajax(requestConfig).then(function(responseMessage) {
            // Create list items for each show
            if (responseMessage.liked) {
                let like_img = $(`#like-${id}`);
                like_img.attr("src", "/public/img/like-filled.png");
            }

        })
    }



})(window.jQuery);