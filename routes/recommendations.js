const express = require("express");
const router = express.Router();
const movies = require("../data/movies");
const routesUtils = require("./routes-utils");
const recommender = require("movie-recommender")

router.get("/", async (req, res, next) => {
    if (!routesUtils.authenticateUser(req, res)) return;
    // fetches list of user's liked movies
    let userId = req.user.userId
    let likedMoves = req.user.liked

    if(!likedMoves) return;

    likedMoves.map((v) => {
        likedMoves.title
    })

    // generates list of recommendations (with movie titles)
    let recs = await recommender(likedMoves, 20)

    // returns list in following format
    /*

[
        {
    "movie": {
      "id": "398",
      "adult": "False",
      "budget": "7000000",
      "genres": [
        {
          "id": 80,
          "name": "Crime"
        },
        {
          "id": 18,
          "name": "Drama"
        }
      ],
      "homepage": "http://www.sonyclassics.com/capote/",
      "language": "en",
      "title": "Capote",
      "overview": [
          ...
      ],
      "popularity": "6.01272",
      "studio": [
        ...
      ],
      "release": "2005-09-30",
      "revenue": "49084830",
      "runtime": "114.0",
      "voteAverage": "6.9",
      "voteCount": "394",
      "keywords": [
        
      ]
    },
    "score": 0.4806318410839867
  }
]

    */
    movieInfo = []
    for(let rec of recs) {
        let m = movies.getMovieById(rec.id)
        movieInfo.push(m)
    }
    res.json(movieInfo)
});