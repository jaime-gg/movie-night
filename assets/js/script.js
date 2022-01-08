const imdbApiKey = "k_bxw4k76r"

let favoriteMovies = [];

let autoFillMovies = []


/**
 * Displays error text and removes error text after 10 seconds
 * @param errorMessage
 */
const errorHandler = (errorMessage) => {

    const errorEl = $("<div class='notification is-warning '>").text(errorMessage)

    $("#error-handler").append(errorEl)

    const deleteError = setInterval(()=>{
        $(errorEl).remove()
        clearInterval(deleteError)
    },10*1000)

}

/**
 * Creates an array of 250 movies that are used for autofilling the search movie form
 */
const createAutoFillListOfMovies = function () {
    fetch(`https://imdb-api.com/en/API/Top250Movies/${imdbApiKey}`).then(response => {
        if (response.ok) {
            response.json().then(data => {
                for (let movie of data.items) {
                    autoFillMovies.push(movie.title)
                }
            })
        }else{
            errorHandler("Cannot get info from IMDB")
        }
    })
}

/**
 * Creates a random movie from the array of 250 movies and displays the movie
 */
const getRandomMovie = () => {
    const index = Math.floor(Math.random() * autoFillMovies.length)
    getMovieInformation(autoFillMovies[index])
}

/**
 * fetches information on the movie submited creates the movie card if a card is found
 * @param movie
 */
var getMovieInformation = function (movie) {
    var apiUrl = 'https://www.omdbapi.com/?apikey=301ca359&t=' + movie + '&plot=full';
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    if ("Error" in data) {
                        errorHandler("unable to find data for this movie")
                    } else {
                        displayMovieData(data);
                    }
                });
            } else {
                errorHandler("unable to find data for this movie")
            }
        });
}

/**
 * organizes the information retreived on a movie
 * @param movieInfo
 */
var displayMovieData = function (movieInfo) {

    const parseRatingData = (ratingArray) => {

        let ratings = {
            imdb: "N/A",
            rottenTomatoes: "N/A",
            metaCritic: "N/A",
        }

        for (let ratingSource of ratingArray) {
            switch (ratingSource.Source) {
                case "Internet Movie Database":
                    ratings.imdb = `${Math.trunc(eval(ratingSource.Value) * 100)}%`
                    break;
                case 'Rotten Tomatoes':
                    ratings.rottenTomatoes = ratingSource.Value
                    break;
                case 'Metacritic':
                    ratings.metaCritic = `${Math.trunc(eval(ratingSource.Value) * 100)}%`
                    break;
            }
        }
        return ratings
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

}

/**
 * Generates a Movie card based on the Movie Details Objects passed into it
 * @param movieDetails - and object composed on movieTitle, moviePlot, moviePoster, rating, movieRuntime, movieYear, whereToView
 */
const createMovieCard = (movieDetails) => {

    //TODO - write a function to check if this movie is in the favorites on creation
    const isMovieFavorited = favoriteMovies.includes(movieDetails.movieTitle)

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
    const deleteButtonEl = $("<i class='card-footer-item fas fa-trash'>")
    favoriteButton.appendTo(cardFooter)
    moreButton.appendTo(cardFooter)
    deleteButtonEl.appendTo(cardFooter)
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
        saveMovieHandler(movieDetails.movieTitle)
    })

    //Handler for deleting the card
    $(deleteButtonEl).click(function () {
        column.remove()
    })

    $("#Search-Cards").append(column)
}

/**
 * Handles saving and removing movies
 * @param movieTitle
 */
const saveMovieHandler = (movieTitle) => {
    //if movie is not in favorite
    if (!favoriteMovies.includes(movieTitle)) {
        favoriteMovies.push(movieTitle)
        localStorage.setItem('favorites', JSON.stringify(favoriteMovies))
    } else {
        const indexToRemove = favoriteMovies.indexOf(movieTitle)
        if (indexToRemove !== -1) {
            favoriteMovies.splice(indexToRemove, 1)
            localStorage.setItem('favorites', JSON.stringify(favoriteMovies))
        }
    }
}

/**
 * Loads local storage if it exists
 */
const loadMovieFavorites = () => {
    const retrieval = localStorage.getItem("favorites")

    if (retrieval === null) {
        favoriteMovies = []
    } else {
        favoriteMovies = JSON.parse(retrieval)
    }
}


/**
 * Submit movie handler
 */
$("#form").submit(function (event) {
    event.preventDefault();
    const input = $($(this)[0][0]).val().trim()
    getMovieInformation(input)
    $("#autocomplete").val("")
})

/**
 * Popular movie button handler
 */
$("#popular").click(() => {
    getRandomMovie()
})

/**
 * Handler for the autocomplete
 */
$("#autocomplete").autocomplete({
    source: (request, response) => {
        let results = $.ui.autocomplete.filter(autoFillMovies, $("#autocomplete").val());
        response(results.slice(0, 10))
    },
    open: function () {
        $("ul.ui-menu").width($(this).innerWidth())
    },
    minLength: 0,

})

createAutoFillListOfMovies()

loadMovieFavorites();