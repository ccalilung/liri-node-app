require("dotenv").config();

var keys = require("./keys")
var Twitter = require('twitter');
var Spotify = require('node-spotify-api')
var omdb = require('request')
var fs = require('fs')


var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

function showTweets() {


  client.get('statuses/user_timeline', 20, function (error, tweets, response) {
    if (!error) {

    }

    tweets.forEach(tweeter => {
      console.log(tweeter.text + " " + tweeter.created_at)
    })
  })
}

function theSpotify() {
  var searchField = process.argv[3]
  var check = 0
  function searchSpotify(searchField) {
    spotify.search({
      type: 'track',
      query: searchField
    }, function (err, data) {
      if (data === null) {
        searchField = "The Sign Ace of Base"
        searchSpotify(searchField)
      }
      else{
      console.log("Artist(s): " + data.tracks.items[0].artists[0].name)
      console.log("Song Name: " + data.tracks.items[0].name)
      if (data.tracks.items[0].preview_url === null) {
        console.log("No Preview URL available")
      } else {
        console.log(data.tracks.items[0].preview_url)
      }
      console.log("Album: " + data.tracks.items[0].album.name)}


    });
  }

  searchSpotify(searchField);
  
}

function omdbQuery(search) {
  var search = process.argv[3];
  var searchSplit = search.split(" ")
  var searchTerm = searchSplit.join("+")

  function omdbCall(searchTerm) {
    omdb('http://www.omdbapi.com/?t=' + searchTerm + '&y=&plot=short&apikey=25914f82', function (error, response, body) {

      if (!error && response.statusCode === 200) {
        if (JSON.parse(body).Response === "False") {
          console.log("Wrong!")
          searchTerm = "Mr+Nobody"
          omdbCall(searchTerm);

        } else {
          console.log("The movie's title: " + JSON.parse(body).Title)
          console.log("Year: " + JSON.parse(body).Year)
          console.log("The movie's IMDB Rating: " + JSON.parse(body).imdbRating)
          let rating = JSON.parse(body).Ratings
          for (i = 0; i < rating.length; i++) {
            if (rating[i].Source === "Rotten Tomatoes") {
              console.log("Rotten Tomatoes Rating: " + rating[i].Value)
            }
          }
          console.log("Country: " + JSON.parse(body).Country)
          console.log("Language: " + JSON.parse(body).Language)
          console.log("Actors: " + JSON.parse(body).Actors)
          console.log("Plot: " + JSON.parse(body).Plot)

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
      console.log("Tweeted: " + tweet)
    }
  });
}



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
  })

}