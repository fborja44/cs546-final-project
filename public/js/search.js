(function ($) {

    $(document).ready(function() {
        var searchError = $("#client-error");
        searchError.hide();
    })

    const searchForm = $("#game-search");
    searchForm.submit(function(event) {
        try {
            const search = $("#search");
            const searchVal = search.val();
            if (!searchVal || searchVal.trim().length === 0) {
                throw "Search term must be non empty";
            }
        } catch (e) {
            event.preventDefault();
            const searchError = $("#client-error");
            searchError.html(`<p>Error: ${e}</p>`);
            searchError.addClass("form-error");
            searchError.show();
        }
    });
    
})(window.jQuery); // jQuery is exported as $ and jQuery