
var getMovieInformation = function(movie) {
    var apiUrl = 'http://www.omdbapi.com/?apikey=301ca359&t=' + movie + '&plot=full';
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    displayMovieData(data);
                });
            }
            else {
                //replace this later with a modal so the user can see it since we can't use alerts
                console.log("unable to find data for this movie")
            }
        });
}

var displayMovieData = function (movieInfo) {
//probably way more info here than we need, but I just wanted to create all these so we can use what we want!

    const parseRatingData = (ratingArray) => {

        let ratings = {
            imdb: "N/A",
            rottenTomatoes: "N/A",
            metaCritic: "N/A",
        }

        if (ratingArray.length > 1) {
            for (let ratingSource of ratingArray) {
                switch (ratingSource.Source) {
                    case "Internet Movie Database":
                        ratings.imdb = `${eval(ratingSource.Value) * 100}%`
                        break;
                    case 'Rotten Tomatoes':
                        ratings.rottenTomatoes = ratingSource.Value
                        break;
                    case 'Metacritic':
                        ratings.metaCritic = `${eval(ratingSource.Value) * 100}%`
                        break;
                }
            }
            return ratings
        } else {
            return ratings
        }
    }

    let movieDetails = {
        movieTitle: movieInfo.Title,
        moviePlot: movieInfo.Plot,
        moviePoster: movieInfo.Poster,
        rating: parseRatingData(movieInfo.Ratings),
        movieRuntime: movieInfo.Runtime,
        movieYear: movieInfo.Year,
        whereToView: ""
    }

    createMovieCard(movieDetails)

    var movieTitle = JSON.stringify(movieInfo.Title);
    console.log(movieTitle);

    var moviePlot = JSON.stringify(movieInfo.Plot);
    console.log(moviePlot);

    var moviePoster = JSON.stringify(movieInfo.Poster);
    console.log(moviePoster);

    var movieRatings = movieInfo.Ratings;
    for (var i = 0; i < movieRatings.length; i++) {
        var rating = movieRatings[i].Source + ' gives this movie ' + movieRatings[i].Value;
        console.log(rating);
    }

    var movieRuntime = JSON.stringify(movieInfo.Runtime);
    console.log(movieRuntime);

    var movieYear = JSON.stringify(movieInfo.Year);
    console.log(movieYear);

    var movieActors = JSON.stringify(movieInfo.Actors);
    console.log(movieActors);
}

getMovieInformation('cars');

/**
 * Generates a Movie card based on the Movie Details Objects passed into it
 * @param movieDetails - and object composed on movieTitle, moviePlot, moviePoster, rating, movieRuntime, movieYear, whereToView
 */
const createMovieCard = (movieDetails) => {

    //TODO - write a function to check if this movie is in the favorites on creation
    const isMovieFavorited = false

    //Create Column
    const column = $("<div class='column'>")

    //Create Card
    const cardEl = $("<div class='card' style='width:500px'>")
    cardEl.appendTo(column)

    //Card Header
    const cardHeader = $("<div class='card-header'>")
    const cardHeaderTitle = $("<p class='card-header-title'>")
    cardHeaderTitle.text(movieDetails.movieTitle)
    cardHeaderTitle.appendTo(cardHeader)
    cardHeader.appendTo(cardEl)

    //TODO This delete button location is temporary
    //Card DeleteButton
    const deleteButtonEl = $("<i class='card-header-title fas fa-trash'>")
    deleteButtonEl.appendTo(cardHeader)

    //Card Poster
    const cardPosterEl = $("<div class='card-image'>")
    const cardPosterFigureEl = $("<figure class='image is-4by3'>")
    const cardImageEl = $(`<img src=${movieDetails.moviePoster} alt="movie poster">`)
    cardImageEl.appendTo(cardPosterFigureEl)
    cardPosterFigureEl.appendTo(cardPosterEl)
    cardPosterEl.appendTo(cardEl)

    //Card ContentPreview
    const cardContentPreview = $("<div class='card-content'>")
    const cardContentPreviewContent = $("<div class='content columns'>")
    const cardContentPreviewIMDB = $("<div class='column'>").text(`IMDb: ${movieDetails.rating.imdb}`)
    const cardContentPreviewRottenTomatoes = $("<div class='column is-two-fifths'>").text(`Rotten Tomatoes: ${movieDetails.rating.rottenTomatoes}`)
    const cardContentPreviewMetaCritic = $("<div class='column'>").text(`MetaCritic: ${movieDetails.rating.metaCritic}`)
    cardContentPreviewIMDB.appendTo(cardContentPreviewContent)
    cardContentPreviewMetaCritic.appendTo(cardContentPreviewContent)
    cardContentPreviewRottenTomatoes.appendTo(cardContentPreviewContent)
    cardContentPreviewContent.appendTo(cardContentPreview)
    cardContentPreview.appendTo(cardEl)

    //Card Content Full Details
    const cardContentFull = $("<div class='card-content'>")
    const cardContentFullContent = $("<div class='content'>")
    cardContentFullContent.text(movieDetails.moviePlot)
    cardContentFullContent.appendTo(cardContentFull)
    cardContentFull.appendTo(cardEl)

    //Card Footer Actions
    const cardFooter = $("<footer class='card-footer'>")
    const favoriteButton = $("<i class='card-footer-item'>")
    const moreButton = $("<i class='fas fa-angle-down card-footer-item'>")
    favoriteButton.appendTo(cardFooter)
    moreButton.appendTo(cardFooter)
    cardFooter.appendTo(cardEl)

    //Sets favorite icon depending on if the movie is already favorite on creation
    if (isMovieFavorited) {
        $(favoriteButton).addClass("fas fa-heart")
    } else {
        $(favoriteButton).addClass("far fa-heart")
    }

    //Sets the card default to collapsed
    $(cardContentFull).toggle("down")

    //Handler for expanding the card and for changing the icons on click
    $(moreButton).click(function () {
        $(cardContentFull).toggle("down")
        const directionDown = $(moreButton).hasClass("fa-angle-down")
        if (directionDown) {
            moreButton.removeClass("fa-angle-down")
            moreButton.addClass("fa-angle-up")
        } else {
            moreButton.removeClass("fa-angle-up")
            moreButton.addClass("fa-angle-down")
        }
    })

    //Handler for favoriting the movie
    $(favoriteButton).click(function () {
        const notFavorited = $(favoriteButton).hasClass("far")
        if (notFavorited) {
            favoriteButton.removeClass("far")
            favoriteButton.addClass("fas")
        } else {
            favoriteButton.removeClass("fas")
            favoriteButton.addClass("far")
        }
    })

    //Handler for deleting the card
    $(deleteButtonEl).click(function () {
        cardEl.remove()
    })

    //TODO Jamie need you help knowing what Class/ID To append to
    $("#Search-Cards").append(column)
}

