const models = require("../models");
const validators = require("../utils/validators");
const movielens = require("./movielens-api");
var _ = require("lodash");

async function getMovieById(movieId) {
  if (!validators.isPositiveNumber(movieId))
    throw "Please provide a valid movie ID";

  let movie = await models.Movie.findById(movieId).exec();

  if (!movie) {
    // Try to grab it from Movielens and add it to our DB
    try {
      let mLensMovie = await movielens.getMovieById(movieId);
      if (!mLensMovie) return undefined; // Couldn't find the movie with that ID

      mLensMovie = mLensMovie.movieDetails.movie;

      movie = models.Movie({
        _id: mLensMovie.movieId,
        title: mLensMovie.title,
        year: mLensMovie.releaseYear,
        posterUrl: mLensMovie.posterPath,
      });
    } catch (e) {
      throw e.response.data.message;
    }

    movie = await saveSafely(movie);
  }

  return movie;
}

async function addComment(movieId, userId, userName, comment) {
  if (!validators.isNonEmptyString(userId))
    throw "Please provide a valid user ID";
  if (!validators.isPositiveNumber(movieId))
    throw "Please provide a valid movie ID";
  if (!validators.isNonEmptyString(comment))
    throw "Please provide the comment text";

  const movie = await getMovieById(movieId);

  const commentObj = models.Comment({ userId, comment, userName });

  movie.comments.push(commentObj);

  return await saveSafely(movie);
}

async function getCommentById(movieId, commentId) {
  if (!validators.isNonEmptyString(commentId))
    throw "Please provide a valid user ID";
  if (!validators.isPositiveNumber(movieId))
    throw "Please provide a valid movie ID";

  const movie = await getMovieById(movieId);
  return movie.comments.find((c) => c._id === commentId);
}

async function removeComment(movieId, commentId) {
  if (!validators.isPositiveNumber(movieId))
    throw "Please provide a valid movie ID";
  if (!validators.isNonEmptyString(commentId))
    throw "Please provide a valid comment ID";

  const movie = await getMovieById(movieId);

  _.remove(movie.comments, (comment) => comment._id == commentId);

  return await saveSafely(movie);
}

async function editComment(movieId, commentId, newCommentText) {
  if (!validators.isPositiveNumber(movieId))
    throw "Please provide a valid movie ID";
  if (!validators.isNonEmptyString(commentId))
    throw "Please provide a valid comment ID";

  const movie = await getMovieById(movieId);

  for (comment of movie.comments) {
    if (comment._id === commentId) {
      comment.comment = newCommentText;
    }
  }

  return await saveSafely(movie);
}

async function saveSafely(document) {
  try {
    return await document.save();
  } catch (e) {
    throw e.message;
  }
}

module.exports = {
  getMovieById,
  addComment,
  removeComment,
  editComment,
  getCommentById,
};
