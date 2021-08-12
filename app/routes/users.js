const { response } = require("express");
const express = require("express");
const router = express.Router();
const data = require("../data");
const validators = require("../utils/validators");

router.post("/", async (req, res, next) => {
  const { name, email } = req.body;
  if (!validators.isLettersOnly(name)) {
    res
      .status(400)
      .json({
        error: `Invalid user name: ${name}. User name should be alphanumeric value`,
      });
    return;
  }
  if (!validators.isValidEmail(email)) {
    res.status(400).json({ error: "Please provide a valid email address" });
    return;
  }

  const user = await data.users.createUser(name, email);
  return res.json(user);
});

router.put("/:userId", async (req, res, next) => {
  const { name, email } = req.body;
  if (!validators.isLettersOnly(name)) {
    res
      .status(400)
      .json({
        error: `Invalid user name: ${name}. User name should be alphanumeric value`,
      });
    return;
  }
  if (!validators.isValidEmail(email)) {
    res.status(400).json({ error: "Please provide a valid email address" });
    return;
  }

  const userId = req.params.userId;
  if (!validators.isNonEmptyString(userId)) {
    res.status(400).json({ error: "You must provide valid userID" });
    return;
  }

  const user = await data.users.getUserById(userId);
  if (!user) {
    res
      .status(404)
      .json({ error: "Could not find user with the given ID: " + userId });
    return;
  }

  // TODO accept picture upload and generate URL for it
  let pictureUrl = "";

  const updatedUser = await data.users.updateUser(
    userId,
    name,
    email,
    pictureUrl
  );
  res.json(updatedUser);
});

router.get("/:userId", async (req, res, next) => {
  const userId = req.params.userId;
  if (!validators.isNonEmptyString(userId)) {
    res.status(400).json({ error: "You must provide valid userID" });
    return;
  }

  const user = await data.users.getUserById(userId);
  if (!user) {
    res
      .status(404)
      .json({ error: "Could not find user with the given ID: " + userId });
    return;
  }

  res.json(user);
});

router.post("/:userId/{movieList}/:movieId", async (req, res, next) => {
  const userId = req.params.userId;
  const movieList = req.params.moviesCategory;
  const movieId = req.params.movieId;

  if (!validators.isNonEmptyString(userId)) {
    res.status(400).json({ error: "You must provide valid userID" });
    return;
  }

  if (!validators.isNonEmptyString(movieList)) {
    res
      .status(400)
      .json({
        error:
          "You must provide valid movie list one of (likedMovies, dislikedMovies, wishMovies)",
      });
    return;
  }
  if (!validators.isPositiveNumber(movieId)) {
    res.status(400).json({ error: "You must provide valid movie ID" });
    return;
  }

  const user = await data.users.getUserById(userId);
  if (!user) {
    res
      .status(404)
      .json({ error: "Could not find user with the given ID: " + userId });
    return;
  }

  const movie = await data.movies.getMovieById(movieId);
  if (!movie) {
    res
      .status(404)
      .json({ error: "Could not find movie with the given ID: " + movieId });
    return;
  }

  const result = await data.users.addMovieToUserList(
    userId,
    movieId,
    movieList
  );
  res.json(result);
});

router.delete("/:userId/{movieList}/:movieId", async (req, res, next) => {
  const userId = req.params.userId;
  const movieList = req.params.moviesCategory;
  const movieId = req.params.movieId;

  if (!validators.isNonEmptyString(userId)) {
    res.status(400).json({ error: "You must provide valid userID" });
    return;
  }

  if (!validators.isNonEmptyString(movieList)) {
    res
      .status(400)
      .json({
        error:
          "You must provide valid movie list one of (likedMovies, dislikedMovies, wishMovies)",
      });
    return;
  }
  if (!validators.isPositiveNumber(movieId)) {
    res.status(400).json({ error: "You must provide valid movie ID" });
    return;
  }

  const user = await data.users.getUserById(userId);
  if (!user) {
    res
      .status(404)
      .json({ error: "Could not find user with the given ID: " + userId });
    return;
  }

  const movie = await data.movies.getMovieById(movieId);
  if (!movie) {
    res
      .status(404)
      .json({ error: "Could not find movie with the given ID: " + movieId });
    return;
  }

  const result = await data.users.removeMovieFromUserList(
    userId,
    movieId,
    movieList
  );
  res.json(result);
});

module.exports = router;
