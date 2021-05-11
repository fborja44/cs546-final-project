(function($) {
    let games = $(".games");

    if (games.eq(0).attr('id')) {
        // Onload, check if a game is followed. If it is, then change the icon to filled
        for (let i = 0; i < games.length; i++) {
            let game = games.eq(i)
            let id = game.attr('id');
            let requestConfig = {
                method: 'GET',
                url: `/games/follow/${id}`,
                contentType: 'application/json',
            }
            $.ajax(requestConfig).then(function(responseMessage) {
                // Create list items for each show
                if (responseMessage.followed) {
                    let follow = $(`#follow-${id}`);
                    follow.html(`<img src="/public/img/follow.png" alt="">Unfollow`);
                }

            })
        }
    }

})(window.jQuery);