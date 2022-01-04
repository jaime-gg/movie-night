var getMovieInformation = function (movie) {
    var apiUrl = 'http://www.omdbapi.com/?apikey=301ca359&t=' + movie + '&plot=full';
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    displayMovieData(data);
                });
            } else {
                //replace this later with a modal so the user can see it since we can't use alerts
                console.log("unable to find data for this movie")
            }
        });
}

var displayMovieData = function (movieInfo) {
//probably way more info here than we need, but I just wanted to create all these so we can use what we want!

    let movieDetails = {
        movieTitle: movieInfo.Title,
        moviePlot: movieInfo.Plot,
        moviePoster: movieInfo.Poster,
        rating: "",
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


const createMovieCard = (movieDetails) => {

    let cardEl = $("<div class='card' style='width:500px'>")

    //Card Header
    let cardHeader = $("<div class='card-header'>")
    let cardHeaderTitle = $("<p class='card-header-title'>")
    cardHeaderTitle.text(movieDetails.movieTitle)
    cardHeaderTitle.appendTo(cardHeader)
    cardHeader.appendTo(cardEl)

    //Card Poster
    let cardPosterEl = $("<div class='card-image'>")
    let cardPosterFigureEl = $("<figure class='image is-4by3'>")
    let cardImageEl = $(`<img src=${movieDetails.moviePoster} alt="movie poster">`)
    cardImageEl.appendTo(cardPosterFigureEl)
    cardPosterFigureEl.appendTo(cardPosterEl)
    cardPosterEl.appendTo(cardEl)

    //Card ContentPreview
    let cardContentPreview = $("<div class='card-content'>")
    let cardContentPreviewContent = $("<div class='content'>")
    cardContentPreviewContent.text("temp")
    cardContentPreviewContent.appendTo(cardContentPreview)
    cardContentPreview.appendTo(cardEl)

    //Card Content Full Details
    let cardContentFull = $("<div class='card-content'>")
    let cardContentFullContent = $("<div class='content'>")
    cardContentFullContent.text(movieDetails.moviePlot)
    cardContentFullContent.appendTo(cardContentFull)
    cardContentFull.appendTo(cardEl)

    //Card Footer Actions
    let cardFooter = $("<footer class='card-footer'>")
    let favoriteButton = $("<i class='far fa-heart card-footer-item'>")
    let moreButton = $("<i class='fas fa-angle-down card-footer-item'>")
    favoriteButton.appendTo(cardFooter)
    moreButton.appendTo(cardFooter)
    cardFooter.appendTo(cardEl)

    $(cardContentFull).toggle("down")

    //Handler for expanding the card and for changing the icons on click
    $(moreButton).click(()=>{
        $(cardContentFull).toggle("down")
        let directionDown = $(moreButton).hasClass("fa-angle-down")
        console.log(directionDown)
        if(directionDown){
            moreButton.removeClass("fa-angle-down")
            moreButton.addClass("fa-angle-up")
        }else{
            moreButton.removeClass("fa-angle-up")
            moreButton.addClass("fa-angle-down")
        }
    })

    //Handler for favoriting the movie and changing the card on click
    $(favoriteButton).click(()=>{
        let notFavorited = $(favoriteButton).hasClass("far")
        console.log(notFavorited)
        if(notFavorited){
            favoriteButton.removeClass("far")
            favoriteButton.addClass("fas")
        }else{
            favoriteButton.removeClass("fas")
            favoriteButton.addClass("far")
        }
    })

    $(".test").append(cardEl)
}