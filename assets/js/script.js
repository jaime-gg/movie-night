fetch('http://www.omdbapi.com/?apikey=301ca359&t=beauty+and+the+beast&plot=full')
    .then(function(response) {
        console.log(response);
        response.json().then(function (data) {
            console.log(data);
        })
    });