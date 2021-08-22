const express = require("express");
const router = express.Router();
const users = require("../data/users");
const routesUtils = require("./routes-utils");
const redis = require("redis");
const { getRecommendations } = require("../data/movies-recommendations");

router.get("/", async (req, res) => {
  if (!routesUtils.authenticateUser(req, res)) return;

  let user = await users.getUserById(req.user._id);
  let likedMovies = user.liked;
  if (!likedMovies) {
    res.json([]);
  } else {
    let recs = await getRecommendations(likedMovies);
    res.json(recs);
  }
});
