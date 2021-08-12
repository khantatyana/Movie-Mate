const express = require("express");
const router = express.Router();
const data = require("../data");
const validators = require("../utils/validators");
const xss = require("xss");
const routesUtils = require("./routes-utils");

router.get("/explore", async (req, res, next) => {
  try {
    const result = await data.movielens.queryMovies(req.query);
    res.json(result);
  } catch (e) {
    res.status(500).json(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const movieId = req.params.id;
    if (!validators.isPositiveNumber(movieId)) {
      res.status(400).json({ error: "You must provide valid movie ID" });
      return;
    }
    const movielensMovie = await data.movielens.getMovieById(movieId);
    const ourMovie = await data.movies.getMovieById(movieId);
    movielensMovie.comments = ourMovie.comments;
    res.json(movielensMovie); // We return movielens movie with comments filled in from our database
  } catch (e) {
    res.status(500).json(e);
  }
});

router.post("/:id/comments", async (req, res, next) => {
  try {
    const movieId = req.params.id;

    const comment = xss(req.body.comment);

    if (!validators.isPositiveNumber(movieId)) {
      res
        .status(400)
        .json({ error: "You must provide valid movie ID for the comment" });
      return;
    }

    if (!validators.isNonEmptyString(comment)) {
      res.status(400).json({ error: "You must provide a comment text" });
      return;
    }
    if (!routesUtils.authenticateUser(req, res)) return;

    const movieObject = await data.movies.addComment(
      movieId,
      req.user._id,
      req.user.name,
      comment
    );
    res.json(movieObject);
  } catch (e) {
    res.status(500).json(e);
  }
});

router.delete("/:id/comments/:commentId", async (req, res, next) => {
  const movieId = req.params.id;
  const commentId = req.params.commentId;

  if (!validators.isPositiveNumber(movieId)) {
    res
      .status(400)
      .json({ error: "You must provide valid movie ID for the comment" });
    return;
  }
  if (!validators.isNonEmptyString(commentId)) {
    res
      .status(400)
      .json({ error: "You must provide valid comment ID to delete" });
    return;
  }

  if (!routesUtils.authenticateUser(req, res)) return;

  const commentData = await data.movies.getCommentById(movieId, commentId);
  if (!commentData) {
    res.status(400).json({
      error: "Could not find a comment with the given ID " + commentId,
    });
    return;
  }

  if (!routesUtils.authorizeUser(commentData.userId, req, res)) return;

  const movieObject = await data.movies.removeComment(movieId, commentId);
  res.json(movieObject);
});

router.put("/:id/comments/:commentId", async (req, res, next) => {
  const movieId = req.params.id;
  const commentId = req.params.commentId;
  const commentText = xss(req.body.comment);

  if (!validators.isPositiveNumber(movieId)) {
    res
      .status(400)
      .json({ error: "You must provide valid movie ID for the comment" });
    return;
  }
  if (!validators.isNonEmptyString(commentId)) {
    res
      .status(400)
      .json({ error: "You must provide valid comment ID to edit" });
    return;
  }

  if (!routesUtils.authenticateUser(req, res)) return;

  const commentData = await data.movies.getCommentById(movieId, commentId);
  if (!commentData) {
    res.status(400).json({
      error: "Could not find a comment with the given ID " + commentId,
    });
    return;
  }

  if (!routesUtils.authorizeUser(commentData.userId, req, res)) return;

  const movieObject = await data.movies.editComment(
    movieId,
    commentId,
    commentText
  );
  res.json(movieObject);
});

module.exports = router;
