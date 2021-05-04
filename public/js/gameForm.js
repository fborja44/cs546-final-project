(function () {

    // https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
    const validURL = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

    const validPrice = /^.+: \$\d+.\d\d$/; // price format
  
    // Add game form
    const form = document.getElementById('game-new'); 
  
    if (form) {
      // References to elements
      const titleElement = document.getElementById('title-input');
      const imageElement = document.getElementById('image-input');
      const publisherElement = document.getElementById('publisher-input');
      const releaseyearElement = document.getElementById('releaseyear-input');
      const descriptionElement = document.getElementById('description-input');
  
      const errorContainer = document.getElementById('gameForm-error-container');

      const genreButtonAdd = document.getElementById('new-genre');
      const genreButtonSub = document.getElementById('remove-genre');

      const genreDiv = document.getElementById('genre-div');

      // Event listeners for add and remove buttons

      // Genre buttons
      let gi = 2; // genre index
      genreButtonAdd.addEventListener("click", (event) => {
        let newInput = document.createElement("input");
        newInput.type = "text";
        newInput.name = "newGenres[]";
        newInput.id = `genre-input${gi}`;
        gi++;
        genreDiv.appendChild(newInput);
      });
      genreButtonSub.addEventListener("click", (event) => {
        gi--;
        if (gi > 1) {
            const remInput = document.getElementById(`genre-input${gi}`);
            genreDiv.removeChild(remInput);
        } else {
            gi = 2;
        }
      });

      // Platform buttons
      const platformButtonAdd = document.getElementById('new-platform');
      const platformButtonSub = document.getElementById('remove-platform');
      const platformDiv = document.getElementById('platform-div');
      let pi = 2; // platform index
      platformButtonAdd.addEventListener("click", (event) => {
        let newInput = document.createElement("input");
        newInput.type = "text";
        newInput.name = "newPlatforms[]";
        newInput.id = `platform-input${pi}`;
        pi++;
        platformDiv.appendChild(newInput);
      });
      platformButtonSub.addEventListener("click", (event) => {
        pi--;
        if (pi > 1) {
            const remInput = document.getElementById(`platform-input${pi}`);
            platformDiv.removeChild(remInput);
        } else {
            pi = 2;
        }
      });

      // Price buttons
      const priceButtonAdd = document.getElementById('new-price');
      const priceButtonSub = document.getElementById('remove-price');
      const priceDiv = document.getElementById('price-div');
      let pri = 2; // price constant
      priceButtonAdd.addEventListener("click", (event) => {
        let newInput = document.createElement("input");
        newInput.type = "text";
        newInput.name = "newPrices[]";
        newInput.id = `price-input${pri}`;
        pri++;
        priceDiv.appendChild(newInput);
      });
      priceButtonSub.addEventListener("click", (event) => {
        pri--;
        if (pri > 1) {
            const remInput = document.getElementById(`price-input${pri}`);
            priceDiv.removeChild(remInput);
        } else {
            pri = 2;
        }
      });

      // Event handler for when the form is submitted
      form.addEventListener('submit', (event) => {
        event.preventDefault();

        try {
            // hide containers by default
            errorContainer.classList.add('hidden');
            
            // Get values
            const title = titleElement.value;
            const image = imageElement.value;
            const publisher = publisherElement.value;
            const releaseYear = releaseyearElement.value;
            const description = descriptionElement.value;

            const genreElement = document.getElementsByName('newGenres[]');
            const platformElement = document.getElementsByName('newPlatforms[]');
            const priceElement = document.getElementsByName('newPrices[]');

            let genres = [];
            let platforms = [];
            let prices = [];

            // Get array values
            for (let x of genreElement) {
                genres.push(x.value);
                x.classList.remove("gameFormInputError");
            }

            for (let x of platformElement) {
                platforms.push(x.value);
                x.classList.remove("gameFormInputError");
            }

            for (let x of priceElement) {
                prices.push(x.value);
                x.classList.remove("gameFormInputError");
            }

            // Remove class that displays red box
            titleElement.classList.remove("gameFormInputError");
            imageElement.classList.remove("gameFormInputError");
            publisherElement.classList.remove("gameFormInputError");
            releaseyearElement.classList.remove("gameFormInputError");
            descriptionElement.classList.remove("gameFormInputError");

            // Error handling
            // Throws at the end after creating an array of all error messages
            let titleError = true;
            let imageError = true;
            let publisherError = true;
            let releaseyearError = true;
            let genreError = true;
            let platformError = true;
            let priceError = true;
            let descriptionError = true;
            let errors = [];
            let errorList = [];
            let errorsMsg = [];
            let error = false;

            // Title error checking
            if (!title && titleError) {
                errorsMsg.push("A title must be provided");
                errorList.push("title");
                titleError = false;
                error = true;
            }
            if (typeof title !== 'string' && titleError) {
                errorsMsg.push("The title must be a string");
                errorList.push("title");
                titleError = false;
                error = true;
            }
            if (title.trim().length === 0 && titleError) {
                errorsMsg.push("The title must not be an empty string");
                errorList.push("title");
                titleError = false;
                error = true;
            }

            // Image error checking
            if (!image && imageError) {
                errorsMsg.push("An image must be provided");
                errorList.push("image");
                imageError = false;
                error = true;
            }
            if (typeof image !== 'string' && imageError) {
                errorsMsg.push(`The image must be a string`);
                errorList.push("image");
                imageError = false;
                error = true;
            }
            if (image.trim().length === 0 && imageError) {
                errorsMsg.push("The image must not be an empty string");
                errorList.push("image");
                imageError = false;
                error = true;
            }
            if (!validURL.test(image) && imageError) {
                errorsMsg.push(`The image must be a valid url`);
                errorList.push("image");
                imageError = false;
                error = true;
            }

            // Publisher error checking
            if (!publisher && publisherError) {
                errorsMsg.push("A publisher must be provided");
                errorList.push("publisher");
                publisherError = false;
                error = true;
            }
            if (typeof publisher !== 'string' && publisherError) {
                errorsMsg.push("The publisher must be a string");
                errorList.push("publisher");
                publisherError = false;
                error = true;
            }
            if (publisher.trim().length === 0 && publisherError) {
                errorsMsg.push("The publisher must not be an empty string");
                errorList.push("publisher");
                publisherError = false;
                error = true;
            }

            // Release year error checking
            if (!releaseYear && releaseyearError) {
                errorsMsg.push("A release year must be provided");
                errorList.push("releaseYear");
                releaseyearError = false;
                error = true;
            }
            if (typeof releaseYear !== 'string' && releaseyearError) {
                errorsMsg.push(`The release year must be a string`);
                errorList.push("releaseYear");
                releaseyearError = false;
                error = true;
            }
            if (releaseYear.trim().length === 0 && releaseyearError) {
                errorsMsg.push("The release year must not be an empty string");
                errorList.push("releaseYear");
                releaseyearError = false;
                error = true;
            }
            if (releaseYear.trim().length !== 4 && releaseyearError) {
                errorsMsg.push("The release year must be a valid year");
                errorList.push("releaseYear");
                releaseyearError = false;
                error = true;
            }
            const releaseYearParsed = parseInt(releaseYear);
            if (isNaN(releaseYearParsed) && releaseyearError)  {
                errorsMsg.push("The release year must be a valid year");
                errorList.push("releaseYear");
                releaseyearError = false;
                error = true;
            }
            let d = new Date();
            if ((releaseYearParsed < 1930 || releaseYearParsed > d.getFullYear() + 5) && releaseyearError) {
                errorsMsg.push("The release year must be a valid year");
                errorList.push("releaseYear");
                releaseyearError = false;
                error = true;
            }

            // Genres error checking
            if (!genres && genreError) {
                errorsMsg.push("Genres must be provided");
                errorList.push("genres");
                genreError = false;
                error = true;
            }
            if (genres.length === 0 && genreError) {
                errorsMsg.push("There must be at least one genre provided");
                errorList.push("genres");
                genreError = false;
                error = true;
            }
            let genreIndex = [];
            let genreEmptyString = false;
            for (let i = 0; i < genres.length; i++) {
                if (genres[i].trim().length === 0 && genreError) {
                    genreIndex.push(i+1);
                    genreEmptyString = true;
                }
            }
            if (genreEmptyString) {
                errorsMsg.push("The genres must not have an empty string");
                errorList.push("genres");
                genreError = false;
                error = true;
            }

            // Platforms error checking
            if (!platforms && platformError) {
                errorsMsg.push("Platforms must be provided");
                errorList.push("platforms");
                platformError = false;
                error = true;
            }
            if (platforms.length === 0 && platformError) {
                errorsMsg.push("There must be at least one platform provided");
                errorList.push("platforms");
                platformError = false;
                error = true;
            }
            let platformIndex = [];
            let platformEmptyString = false;
            for (let i = 0; i < platforms.length; i++) {
                if (platforms[i].trim().length === 0 && platformError) {
                    platformIndex.push(i+1);
                    platformEmptyString = true;
                }
            }
            if (platformEmptyString) {
                errorsMsg.push("The platforms must not have an empty string");
                errorList.push("platforms");
                platformError = false;
                error = true;
            }

            // Prices error checking
            if (!prices && priceError) {
                errorsMsg.push("Prices must be provided");
                errorList.push("prices");
                priceError = false;
                error = true;
            }
            if (prices.length === 0 && priceError) {
                errorsMsg.push("There must be at least one price provided");
                errorList.push("prices");
                priceError = false;
                error = true;
            }
            let priceIndex = [];
            let priceEmptyString = false;
            for (let i = 0; i < prices.length; i++) {
                if ((prices[i].trim().length === 0 || !validPrice.test(prices[i].trim())) && priceError) {
                    priceIndex.push(i+1);
                    priceEmptyString = true;
                }
            }
            if (priceEmptyString) {
                errorsMsg.push("The prices must be of the proper form");
                errorList.push("prices");
                priceError = false;
                error = true;
            }

            // Description error checking
            if (!description && descriptionError) {
                errorsMsg.push("A description must be provided");
                errorList.push("description");
                descriptionError = false;
                error = true;
            }
            if (typeof description !== 'string' && descriptionError) {
                errorsMsg.push("The description must be a string");
                errorList.push("description");
                descriptionError = false;
                error = true;
            }
            if (description.trim().length === 0 && descriptionError) {
                errorsMsg.push("The description must not be an empty string");
                errorList.push("description");
                descriptionError = false;
                error = true;
            }

            errors.push(errorsMsg);
            errors.push(errorList);
            errors.push(genreIndex);
            errors.push(platformIndex);
            errors.push(priceIndex);

            if (error) {
                throw errors;
            }

            form.submit(); // submit form when no errors were detected
        } catch (e) {
            // Displays the errors in red on the page
            const errorList = document.getElementById("gameFormErrors");
            const empty = document.createElement("ul");
            empty.id = "gameFormErrors";
            for (let x of e[0]) {
                let li = document.createElement('li');
                li.innerHTML = x;
                li.classList.add("gameFormError");
                empty.appendChild(li);
            }
            errorList.replaceWith(empty);
            for (let x of e[1]) {
                if (x === "title") {
                    titleElement.classList.add("gameFormInputError");
                }
                if (x === "image") {
                    imageElement.classList.add("gameFormInputError");
                }
                if (x === "publisher") {
                    publisherElement.classList.add("gameFormInputError");
                }
                if (x === "releaseYear") {
                    releaseyearElement.classList.add("gameFormInputError");
                }
                if (x === "description") {
                    descriptionElement.classList.add("gameFormInputError");
                }
            }

            for (let x of e[2]) {
                let genre = document.getElementById(`genre-input${x}`);
                genre.classList.add("gameFormInputError");
            }

            for (let x of e[3]) {
                let platform = document.getElementById(`platform-input${x}`);
                platform.classList.add("gameFormInputError");
            }
            for (let x of e[4]) {
                let price = document.getElementById(`price-input${x}`);
                price.classList.add("gameFormInputError");
            }
            errorContainer.classList.remove('hidden');
        }
      });
    }
  })();
  