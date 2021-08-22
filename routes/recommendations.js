const express = require("express");
const router = express.Router();
const movies = require("../data/movies");
const routesUtils = require("./routes-utils");
const recommender = require("movie-recommender");
const users = require("../data/users");

router.get("/", async (req, res) => {
  if (!routesUtils.authenticateUser(req, res)) return;
  // fetches list of user's liked movies
  let userId = req.user._id;
  let user = await users.getUserById(userId);
  let likedMovies = user.likedMovies;

  if (!likedMovies) res.json([]);

  likedMovies.map((v) => {
    v.title;
  });

  // generates list of recommendations (with movie titles)
  let recs = await recommender(likedMovies, 20);
  movieInfo = [];
  for (let rec of recs) {
    let m = movies.getMovieById(rec);
    movieInfo.push(m);
  }
  res.json(movieInfo);
});
