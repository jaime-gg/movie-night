
var getMovieInformation = function(movie) {
    var apiUrl = 'http://www.omdbapi.com/?apikey=301ca359&t=' + movie + '&plot=full';
    fetch(apiUrl)
        .then(function(response) {
            response.json().then(function (data) {
                console.log(data);
            })
        });
}


