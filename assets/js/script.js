
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

var displayMovieData = function(movieInfo) {
//probably way more info here than we need, but I just wanted to create all these so we can use what we want! 
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