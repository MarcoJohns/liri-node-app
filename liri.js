require("dotenv").config();

var keys = require('./keys.js');

var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);

var axios = require("axios");

var fs = require('fs');



var getArtistNames = function (artist) {
    return artist.name;
}

var getMeSpotify = function (songName) {

    spotify.search({ type: 'track', query: songName }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        var songs = data.tracks.items;

        for (var i = 0; i < songs.length; i++) {
            console.log(i);
            console.log('\n artist(s): ' + songs[i].artists.map(getArtistNames));
            console.log('\n song name: ' + songs[i].name);
            console.log('\n preview song: ' + songs[i].preview_url);
            console.log('\n album: ' + songs[i].album.name);
            console.log('\n -----------------------------------------');

        }
    });
}

var getMeConcert = function (artistName) {

    axios
        .get("https://rest.bandsintown.com/artists/"+ artistName +"/events?app_id=codingbootcamp")
        .then(function (response) {

            console.log('\n venue name: ' + response.data[0].venue.name)
            console.log('\n venue location: ' + response.data[0].venue.country)
            console.log('\n date of event: ' +response.data[0].datetime)
        })
}


var getMeMovie = function (movieName) {


    axios
        .get("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&r=json&apikey=trilogy")
        .then(function (response) {

            console.log('\n Title: ' + response.data.Title);
            console.log('\n Year: ' + response.data.Year);
            console.log('\n IMDB Rating: ' + response.data.Ratings[0].Value);
            console.log('\n Rotten Tomatoes Rating: ' + response.data.Ratings[1].Value);
            console.log('\n Country: ' + response.data.Country);
            console.log('\n Language: ' + response.data.Language);
            console.log('\n Plot: ' + response.data.Plot);
            console.log('\n Actors: ' + response.data.Actors);
            console.log('\n -----------------------------------------------')
        });
}

var doWhatItSays = function () {
    fs.readFile('./random.txt', 'utf8', function (err, data) {
        if (err) throw err;

        var dataArr = data.split(',');

        if (dataArr.length == 2) {
            pick(dataArr[0], dataArr[1]);
        } else if (dataArr.length == 1) {
            pick(dataArr[0]);
        }
    });
}

var pick = function (caseData, functionData) {
    switch (caseData) {
        case 'concert-this':
            getMeConcert(functionData);
            break;
        case 'spotify-this-song':
            getMeSpotify(functionData);
            break;
        case 'movie-this':
            getMeMovie(functionData);
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
        default:
            console.log('Liri does not know that');
    }
}

var runThis = function (argOne, agrTwo) {
    pick(argOne, agrTwo);
};

runThis(process.argv[2], process.argv[3]);