const express = require("express");
const router = express.Router();
const data = require("../data");
const validators = require("../utils/validators");
const xss = require("xss");

router.get("/", async (req, res, next) => {
  try {
    const result = await data.movielens.queryMovies(req.query, req.genre);
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
    if (!req.session.user) {
      res
        .status(403)
        .json({
          error: "User is not logged in. Please login to post a comment.",
        });
      return;
    }

    const comment = await data.movies.addComment(
      movieId,
      req.session.user._id,
      req.session.user.name,
      comment
    );
    res.json(comment);
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

  if (!req.session.user) {
    res
      .status(403)
      .json({
        error: "User is not logged in. Please login to remove a comment.",
      });
    return;
  }

  const commentData = await data.movies.getCommentById(movieId, commentId);
  if (!commentData) {
    res
      .status(400)
      .json({
        error: "Could not find a comment with the given ID " + commentId,
      });
    return;
  }

  if (commentData.userId !== req.session.user._id) {
    res
      .status(403)
      .json({ error: "You must be the owner of the comment to delete it." });
    return;
  }

  await data.movies.removeComment(movieId, commentId);
  res.sendStatus(200);
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

  if (!req.session.user) {
    res
      .status(403)
      .json({
        error: "User is not logged in. Please login to edit a comment.",
      });
    return;
  }

  const commentData = await data.movies.getCommentById(movieId, commentId);
  if (!commentData) {
    res
      .status(400)
      .json({
        error: "Could not find a comment with the given ID " + commentId,
      });
    return;
  }

  if (commentData.userId !== req.session.user._id) {
    res
      .status(403)
      .json({ error: "You must be the owner of the comment to modify it." });
    return;
  }

  await data.movies.editComment(movieId, commentId, commentText);
  res.sendStatus(200);
});

module.exports = router;
