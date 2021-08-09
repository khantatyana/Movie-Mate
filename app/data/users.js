const models = require("../models");
const validators = require("../utils/validators");
// const movielens = require('./movielens-api');
const movies = require("./movies");
var _ = require("lodash");

async function getUserById(userId) {
  if (!validators.isNonEmptyString(userId))
    throw "Please provide a valid user ID";

  const user = await models.User.findById(userId).exec();
  if (!user) throw `There is no user with the given ID: ${userId}`;
  return user;
}

async function createUser(name, email) {
  if (!validators.isLettersOnly(name))
    throw "User name must be provided and contains only letters";
  if (!validators.isValidEmail(email))
    throw "Please provide a valid email address";

  const newUser = new models.User({ name, email });
  const createdUser = await saveSafely(newUser);
  return createdUser;
}

async function updateUser(id, name, email, pictureUrl) {
  if (!validators.isNonEmptyString(id)) throw "Please provide a valid user ID";
  if (!validators.isLettersOnly(name))
    throw "User name must be provided and contains only letters";
  if (!validators.isValidEmail(email))
    throw "Please provide a valid email address";

  const updatedUser = await models.User.findByIdAndUpdate(
    id,
    { name, email, pictureUrl },
    { new: true }
  ).exec();

  // Update user info inside the comment
  const commentedMovies = await models.Movie.find({
    "comments.userId": id,
  }).exec();
  for (movie of commentedMovies) {
    for (comment of movie.comments) {
      if (comment.userId == id) {
        comment.userName = name;
      }
    }
    await saveSafely(movie);
  }

  return updatedUser;
}

async function addMovieToUserList(userId, movieId, category) {
  if (!validators.isNonEmptyString(userId))
    throw "Please provide a valid user ID";
  if (!validators.isPositiveNumber(movieId))
    throw "Please provide a valid movie ID";
  if (!validators.isNonEmptyString(category))
    throw "Please provide the movie category";

  const user = await models.User.findById(userId).exec();
  if (!user) throw `Couldn't find user with the given ID ${userId}`;

  const movie = await movies.getMovieById(movieId);
  if (!movie) throw `Couldn't get movie with the given ID ${movieId}`;

  user[category].push({
    _id: movie._id,
    title: movie.title,
    year: movie.year,
    posterUrl: movie.posterUrl,
  });

  return await saveSafely(user);
}

async function removeMovieFromUserList(userId, movieId, category) {
  if (!validators.isNonEmptyString(userId))
    throw "Please provide a valid user ID";
  if (!validators.isPositiveNumber(movieId))
    throw "Please provide a valid movie ID";
  if (!validators.isNonEmptyString(category))
    throw "Please provide the movie category";

  const user = await models.User.findById(userId).exec();
  if (!user) throw `Couldn't find user with the given ID ${userId}`;

  const movie = await movies.getMovieById(movieId);
  if (!movie) throw `Couldn't get movie with the given ID ${movieId}`;

  user[category] = _.remove(user[category], (movie) => movie._id === movieId);

  return await saveSafely(user);
}

async function deleteUser(userId) {
  if (!validators.isNonEmptyString(userId))
    throw "Please provide a user ID to delete";
  const deletedUser = await models.User.findByIdAndDelete(userId).exec();
  return deletedUser;
}

async function saveSafely(document) {
  try {
    return await document.save();
  } catch (e) {
    throw e.message;
  }
}

module.exports = {
  getUserById,
  createUser,
  updateUser,
  addMovieToUserList,
  removeMovieFromUserList,
  deleteUser,
};
