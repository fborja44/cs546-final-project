(function($) {
    let games = $(".games");

    if (games.eq(0).attr('id')) {
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
                console.log(responseMessage);
                if (responseMessage.liked) {
                    let like_img = $(`#like-${id}`);
                    like_img.attr("src", "/public/img/like-filled.png");
                }

            })
        }
    }

})(window.jQuery);
