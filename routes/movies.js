const express = require("express");
const router = express.Router();
const data = require("../data");
const validators = require("../utils/validators");
const xss = require("xss");
const routesUtils = require("./routes-utils");
const redisClient = require("../config/redisConnection");

router.get("/explore", async (req, res, next) => {
  try {
    const redisKey = `movies:${JSON.stringify(req.query)}`;
    if (await redisClient.existsAsync(redisKey)) {
      console.log(`Getting ${redisKey} from cache`);
      return res.json(JSON.parse(await redisClient.getAsync(redisKey)));
    }

    const result = await data.movielens.queryMovies(req.query);

    await redisClient.setAsync(redisKey, JSON.stringify(result), "EX", 60 * 60); // one hour

    res.json(result);
  } catch (e) {
    res.status(500).json(e);
  }
});

router.get("/genres", async (req, res, next) => {
  try {
    const redisKey = `movies:genres`;
    if (await redisClient.existsAsync(redisKey)) {
      console.log(`Getting ${redisKey} from cache`);
      return res.json(JSON.parse(await redisClient.getAsync(redisKey)));
    }
    const result = await data.movielens.getGenres();

    await redisClient.setAsync(
      redisKey,
      JSON.stringify(result),
      "EX",
      60 * 60 * 24
    ); // a day

    res.json(result);
  } catch (e) {
    res.status(500).json(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const movieId = req.params.id;

    const redisKey = `movies:${movieId}`;
    if (await redisClient.existsAsync(redisKey)) {
      console.log(`Getting ${redisKey} from cache`);
      return res.json(JSON.parse(await redisClient.getAsync(redisKey)));
    }

    if (!validators.isPositiveNumber(movieId)) {
      res.status(400).json({ error: "You must provide valid movie ID" });
      return;
    }
    const movielensMovie = await data.movielens.getMovieById(movieId);
    const ourMovie = await data.movies.getMovieById(movieId);
    movielensMovie.comments = ourMovie.comments;

    movielensMovie.userLiked = req.user.likedMovies.some(
      (m) => m.id === movieId
    );
    movielensMovie.userDisliked = req.user.dislikedMovies.some(
      (m) => m.id === movieId
    );
    movielensMovie.userWish = req.user.wishMovies.some((m) => m.id === movieId);

    await redisClient.setAsync(redisKey, JSON.stringify(movielensMovie));

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

    await redisClient.delAsync(`movies:${movieId}`); // Invalidate movie cache

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

  await redisClient.delAsync(`movies:${movieId}`); // Invalidate movie cache

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

  await redisClient.delAsync(`movies:${movieId}`); // Invalidate movie cache

  res.json(movieObject);
});

module.exports = router;
