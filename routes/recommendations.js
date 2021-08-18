const express = require("express");
const router = express.Router();
const data = require("../data");
const routesUtils = require("./routes-utils");
const recommender = require("movie-recommender")

router.get("/", async (req, res, next) => {
    // fetches list of movies from MongoDB

    // generates list of recommendations (with movie titles)

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

    // passes data to recs.service.ts

    // which then displays data in Recommendations.tsx
});