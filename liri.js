
var Twitter = require("twitter");

var twitterKeysFile = require("./keys.js");

var Spotify = require('node-spotify-api');
 
var spotify = new Spotify({
  id: "a1fd8afd2d384a6a851ceb00a0eb0c7b",
  secret: "586c3ab81aa74b88997fcd7e1d156b48"
});
var request = require("request");

var fs = require("fs");

var filename = './log.txt';

var log = require('simple-node-logger').createSimpleFileLogger( filename );

log.setLevel('all');

var action = process.argv[2];

var argument = "";

doSomething(action, argument);

function doSomething(action, argument) {

	argument = getThirdArgument();

	switch (action) {

		case "my-tweets": 
		getMyTweets();
		break;

		case "spotify-this-song":

		var songTitle = argument;

		if (songTitle === "") {
			lookupSpecificSong();

		} else {
			getSongInfo(songTitle);
		}
		break;

		case "movie-this":

		var movieTitle = argument;

		if (movieTitle === "") {
			getMovieInfo("Mr. Nobody");

		} else {
			getMovieInfo(movieTitle);
		}
		break;

		case "do-what-it-says": 
		doWhatItSays();
		break;
	}
}

function getThirdArgument() {

	argumentArray = process.argv;

	for (var i = 3; i < argumentArray.length; i++) {
		argument += argumentArray[i];
	}
	return argument;
}

function getMyTweets() {

	var client = new Twitter(twitterKeysFile.twitterKeys);

	var params = {q: '@Scottmtg', count: 20};

	client.get('search/tweets', params, function(error, tweets, response) {
	  if (!error) {

	  	for (var i = 0; i < tweets.statuses.length; i++) {
	  		var tweetText = tweets.statuses[i].text;
	  		logWrite("Tweet Text: " + tweetText);
	  		var tweetCreationDate = tweets.statuses[i].created_at;
	  		logWrite("Tweet Creation Date: " + tweetCreationDate);
	  	}
	  } else {
	  	logWrite(error);
	  }
	});
}

function getSongInfo(songTitle) {

	spotify.search({type: 'track', query: songTitle}, function(err, data) {
		if (err) {
			logWrite(err);
			return
		}	else	{

		logWrite(JSON.parse(data.tracks.name));
	}});
	
}

function lookupSpecificSong() {

	spotify.search({type: 'track', query: 'The Sign'}, function(err, data) {
		if (err) {
			logWrite(err);
			return
		}

		logWrite("Artist: " + data.artists[0].name);
		logWrite("Song: " + data.name);
		logWrite("Spotify Preview URL: " + data.preview_url);
		logWrite("Album Name: " + data.album.name);
	});
}

function getMovieInfo(movieTitle) {

	var queryUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&tomatoes=true&r=json";

	request(queryUrl, function(error, response, body) {

	  if (!error && response.statusCode === 200) {

	    var movie = JSON.parse(body);

	    logWrite("Movie Title: " + movie.Title);
	    logWrite("Release Year: " + movie.Year);
	    logWrite("IMDB Rating: " + movie.imdbRating);
	    logWrite("Country Produced In: " + movie.Country);
	    logWrite("Language: " + movie.Language);
	    logWrite("Plot: " + movie.Plot);
	    logWrite("Actors: " + movie.Actors);

	    logWrite("Rotten Tomatoes Rating: " + movie.Ratings[2].Value);
	    logWrite("Rotten Tomatoes URL: " + movie.tomatoURL);
	  }
	});
}

function doWhatItSays() {

	fs.readFile("random.txt", "utf8", function(err, data) {
		if (err) {
			logWrite(err);
		} else {

			var randomArray = data.split(",");

			action = randomArray[0];

			argument = randomArray[1];

			doSomething(action, argument);
		}
	});
}

function logWrite(logText) {
	log.info(logText);
	console.log(logText);
}