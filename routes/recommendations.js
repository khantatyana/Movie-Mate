const express = require("express");
const router = express.Router();
const movies = require("../data/movies");
const routesUtils = require("./routes-utils");
const recommender = require("movie-recommender");
const users = require("../data/users");

router.get("/", async (req, res) => {
  try {
    if (!routesUtils.authenticateUser(req, res)) return;
    // fetches list of user's liked movies
    let userId = req.user._id;
    let user = await users.getUserById(userId);
    let likedMovies = user.likedMovies;

    if (!likedMovies) res.json([]);

    list = [];
    for (let item of likedMovies) {
      list.push(item.title);
    }
    console.log(list);
    // generates list of recommendations (with movie titles)

    let recs = await recommender.getRecommendations(list, 50);
    // let recs = await recommender.getRecommendations(['Batman Begins', 'Jumanji', 'Capote'], 20);
    console.log(
      "================================================================"
    );
    console.log(recs);
    movieInfo = [];
    for (let rec of recs) {
      if (typeof rec !== "undefined" || res !== null) {
        // let m = await movies.getMovieById(Number.parseInt(rec.movie.id));
        let m = await movies.getMovieById(rec.movie.id);
        if (m) {
          console.log(typeof rec.movie.id + ": " + rec.movie.id);
          movieInfo.push(m);
        }
      }
    }
    console.log(
      "================================================================"
    );
    console.log(movieInfo);
    res.json(movieInfo);
    // res.json(recs)
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;
