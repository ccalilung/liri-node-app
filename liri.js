//variables and required packages/files
require("dotenv").config();
var keys = require("./keys")
var Twitter = require('twitter');
var Spotify = require('node-spotify-api')
var omdb = require('request')
var fs = require('fs')
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);


//run this function for the "my-tweets" argument
function showTweets() {
  client.get('statuses/user_timeline', 20, function (error, tweets, response) {
    if (error) {
      throw "error"
    }
    tweets.forEach(tweeter => {
      var theTweet = tweeter.text + " " + tweeter.created_at
      //log to log.txt file
      fs.appendFile("log.txt",theTweet,function(err){
        console.log(theTweet)
      })
    })
  })
}

//run this function for the "spotify-this-song" argument
function theSpotify() {
  var searchField = process.argv[3]

  function searchSpotify(searchField) {
    spotify.search({
      type: 'track',
      query: searchField
    }, function (err, data) {
      if (data === null) {
        //if no data comes back from the search, run the search again with "The Sign Ace of Base" as the search term
        searchField = "The Sign Ace of Base"
        searchSpotify(searchField)
      }
      //if data comes back for the search, log in CLI the artist(s), song name, preview URL, and album
      else {
        var artist = "Artist(s): " + data.tracks.items[0].artists[0].name
        var songName = "Song Name: " + data.tracks.items[0].name
        if (data.tracks.items[0].preview_url === null) {
          var previewURL = "No Preview URL available"
        } else {
          var previewURL = 'Preview URL: ' + data.tracks.items[0].preview_url
        }
        var album = "Album: " + data.tracks.items[0].album.name
        //log output to log.txt
        fs.appendFile("log.txt", artist + " " + songName + " " + previewURL + " " + album, function (err) {
          console.log(artist)
          console.log(songName)
          console.log(previewURL)
          console.log(album)
        })



      }
    });
  }
  searchSpotify(searchField);
}
//Run this function for the "movie-this" argument
function omdbQuery(search) {
  var search = process.argv[3];
  var searchSplit = search.split(" ")
  var searchTerm = searchSplit.join("+")

  function omdbCall(searchTerm) {
    omdb('http://www.omdbapi.com/?t=' + searchTerm + '&y=&plot=short&apikey=25914f82', function (error, response, body) {
      if (!error && response.statusCode === 200) {
        //if the search term returns nothing, response will be false. if false, rerun the search with Mr Nobody as the search parameter
        if (JSON.parse(body).Response === "False") {
          searchTerm = "Mr+Nobody"
          omdbCall(searchTerm);
        }
        //if the search term returns a movie, print title, year, movie, rating, country, language, actors, and plot
        else {
          var title = "The movie's title: " + JSON.parse(body).Title
          var year = "Year: " + JSON.parse(body).Year
          var imdbRating = "IMDB Rating: " + JSON.parse(body).imdbRating
          var rating = (JSON.parse(body).Ratings)
          for (i = 0; i < rating.length; i++) {
            if (rating[i].Source === "Rotten Tomatoes") {
              var rottenTomatoes = "Rotten Tomatoes Rating: " + rating[i].Value
            }
          }
          var country = "Country: " + JSON.parse(body).Country
          var language = "Language: " + JSON.parse(body).Language
          var actors = "Actors: " + JSON.parse(body).Actors
          var plot = "Plot: " + JSON.parse(body).Plot
          //log to log.txt
          fs.appendFile("log.txt", title + " " + year + " " + imdbRating + " " + rottenTomatoes + " " + country + " " + language + " " + actors + " " + plot, function (err) {
            if (err) {
              return console.log(err);
            }
            console.log(title)
            console.log(year)
            console.log(imdbRating)
            console.log(rottenTomatoes)
            console.log(country)
            console.log(language)
            console.log(actors)
            console.log(plot)
          })

        }
      }
    })
  }
  omdbCall(searchTerm);
}

function tweet() {
  client.post('statuses/update', {
    status: process.argv[3]
  }, function (error, tweet, response) {
    if (!error) {;
    var theTweet = "Tweeted: " + tweet.text;
    fs.appendFile("log.txt",theTweet,function(err){
      if (err){
        throw "error"
      }
      console.log(theTweet)
    })
    }
  });
}


//CLI inputs to run the functions
if (process.argv[2] === "movie-this") {
  omdbQuery();
}
if (process.argv[2] === "my-tweets") {
  showTweets();
}
if (process.argv[2] === "spotify-this-song") {
  theSpotify();
}
if (process.argv[2] === "tweet") {
  tweet();
}
if (process.argv[2] === "do-what-it-says") {
  fs.readFile("random.txt", "utf8", function (error, data) {
    var dataArr = data.split(",");
    var rand = Math.floor(Math.random() * 3)
    if (rand === 0) {
      var newArr = dataArr[rand].split(":")
      process.argv[3] = newArr[1]
      theSpotify();
    }
    if (rand === 2) {
      var newArr = dataArr[rand].split(":")
      process.argv[3] = newArr[1]
      omdbQuery();
    }
    if (rand === 1) {
      showTweets();
    }
  })
}