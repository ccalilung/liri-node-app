# liri-node-app

This project is the Language Interpretation and Recognition Interface. It uses command line arguments to call various APIs. To get started, clone the master and install the Node packages listed below in your project's root directory. You will also need a Spotify, Twitter, and OMDB account with API keys for each.

CLI command #1 - "node liri.js my-tweets" - With a properly setup API key and call with Twitter, this CLI command prints the last 20 tweets and also logs them to log.txt located in the root file. This uses the Twitter npm package.

CLI command #2 - "node liri.js spotify-this-song 'song name here'" - With a properly setup API key and call with Spotify, this CLI command prints the artist, song name, preview URL, and album of a song searched. If no results come back in the API call, the call is made again where the output is for the song "The Sign by Ace of Base." The results also get logged to log.txt This uses the node-spotify-api npm package. 

CLI command #3 - "node liri.js movie-this 'movie title here'" - With a properly setup OMDB API key and call using the request npm package, this CLI command prints the title, year, IMDB rating, rottentomatoes rating, country, language, plot, actors of the movie. The results also get logged to log.txt.

CLI command #4 - "node liri.js do-what-it-says" - This will call one of the 3 previous commands and run it. If spotify, the song searched is the Backstreet Boys "I want it that way." If OMDB search is called, the movie "Good Will Hunting" is searched.

CLI command #5 - "node liri.js tweet 'insert tweet here' - With a properly setup Twitter API key and call, this command will allow you to tweet from the CLI. The output is the tweet and that is logged to log.txt.

The following Node packages are used: 
[Twitter](https://www.npmjs.com/package/twitter)
[Node-Spotify-API](https://www.npmjs.com/package/node-spotify-api)
[Request](https://www.npmjs.com/package/request)
[DotEnv](https://www.npmjs.com/package/dotenv)

Also used are the Node File System and OMDB API (http://www.omdbapi.com).


