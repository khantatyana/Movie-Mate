const { response } = require("express");
const express = require("express");
const router = express.Router();
const data = require("../data");
const validators = require("../utils/validators");
const routesUtils = require("./routes-utils");
var multer = require("multer");
const redisClient = require("../config/redisConnection");

const { Worker } = require("worker_threads");

router.get("/recommendations", async (req, res) => {
  try {
    if (!routesUtils.authenticateUser(req, res)) return;

    if (req.user.likedMovies.length === 0) {
      return res.json({ status: "NO_FAVS" });
    }

    const redisStatusKey = `users:${req.user.id}:recommendations:status`;
    const redisResultKey = `users:${req.user.id}:recommendations:result`;
    const result = {};
    if (await redisClient.existsAsync(redisResultKey)) {
      // We return the cached version if it does exist
      result.recommendations = JSON.parse(
        await redisClient.getAsync(redisResultKey)
      );
    }

    const status = await redisClient.getAsync(redisStatusKey);
    if (status && status === "READY") {
      result.status = "READY";
    } else {
      if (status !== "COMPUTING") {
        // We will need to compute recommendations
        console.log(`Starting recommendations for user ${req.user.name}.`);
        likedTitles = req.user.likedMovies.map((m) => {
          return {
            id: m._id,
            title: m.title,
          };
        });
        const worker = new Worker(
          `${__dirname}/../data/movies-recommendations.js`,
          {
            workerData: { likedMovies: likedTitles },
          }
        );
        console.log("Worker started!");

        worker.on("error", async (err) => {
          await redisClient.setAsync(redisStatusKey, "OUTDATED");
          console.log(`Error from recommendation algorithm: ${err}`);
          await worker.terminate();
        });

        worker.on("message", async (msg) => {
          console.log(`Recommendations for user ${req.user.name} is done.`);
          await redisClient.setAsync(redisResultKey, JSON.stringify(msg));
          await redisClient.setAsync(redisStatusKey, "READY");
          await worker.terminate();
        });

        await redisClient.setAsync(
          redisStatusKey,
          "COMPUTING",
          "EX",
          5 * 60 * 1000
        ); // Computing timeout 5 min
      }

      result.status = "COMPUTING";
    }
    res.json(result);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

router.post("/", async (req, res, next) => {
  const { name, email } = req.body;
  if (!validators.isNonEmptyString(name)) {
    res.status(400).json({
      error: `User name must be provided`,
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
  const { name, email, pictureUrl } = req.body;
  const userId = req.params.userId;

  if (
    !routesUtils.authenticateUser(req, res) ||
    !routesUtils.authorizeUser(userId, req, res)
  )
    return;

  if (!validators.isNonEmptyString(name)) {
    res.status(400).json({
      error: `Username must be provided`,
    });
    return;
  }
  if (!validators.isValidEmail(email)) {
    res.status(400).json({ error: "Please provide a valid email address" });
    return;
  }

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

  if (pictureUrl === null) {
    pictureUrl = user.pictureUrl;
  }

  console.log(pictureUrl);
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

router.post("/:userId/:movieList/:movieId", async (req, res, next) => {
  const userId = req.params.userId;
  const movieList = req.params.movieList;
  const movieId = req.params.movieId;

  if (
    !routesUtils.authenticateUser(req, res) ||
    !routesUtils.authorizeUser(userId, req, res)
  )
    return;

  if (!validators.isNonEmptyString(userId)) {
    res.status(400).json({ error: "You must provide valid userID" });
    return;
  }

  if (!validators.isNonEmptyString(movieList)) {
    res.status(400).json({
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

  // Remove movie from other lists
  if (movieList !== "likedMovies") {
    if (user.likedMovies.id(movieId)) {
      await data.users.removeMovieFromUserList(userId, movieId, "likedMovies");
      // Modifying likedMovies should invalidate cached recommendations
      await invalidateRecommendation(userId);
    }
  } else {
    // Modifying likedMovies should invalidate cached recommendations
    await invalidateRecommendation(userId);
  }

  if (movieList !== "dislikedMovies") {
    await data.users.removeMovieFromUserList(userId, movieId, "dislikedMovies");
  }
  if (movieList !== "wishMovies") {
    await data.users.removeMovieFromUserList(userId, movieId, "wishMovies");
  }

  const result = await data.users.addMovieToUserList(
    userId,
    movieId,
    movieList
  );

  await redisClient.delAsync(`movies:${movieId}`); // Invalidate movie cache

  res.json(result);
});

router.delete("/:userId/:movieList/:movieId", async (req, res, next) => {
  const userId = req.params.userId;
  const movieList = req.params.movieList;
  const movieId = req.params.movieId;

  if (
    !routesUtils.authenticateUser(req, res) ||
    !routesUtils.authorizeUser(userId, req, res)
  )
    return;

  if (!validators.isNonEmptyString(userId)) {
    res.status(400).json({ error: "You must provide valid userID" });
    return;
  }

  if (!validators.isNonEmptyString(movieList)) {
    res.status(400).json({
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

  if (movieList === "likedMovies") {
    // Modifying likedMovies should invalidate cached recommendations
    await invalidateRecommendation(userId);
  }

  await redisClient.delAsync(`movies:${movieId}`); // Invalidate movie cache

  res.json(result);
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "client/public/UserProfileImgs");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage }).single("file");

router.post("/upload", async function (req, res) {
  await upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(500).json(err);
    } else if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    return res.json({ uploadedName: req.file.filename });
  });
});

async function invalidateRecommendation(userId) {
  const redisStatusKey = `users:${userId}:recommendations:status`;
  await redisClient.setAsync(redisStatusKey, "OUTDATED");
}

module.exports = router;
