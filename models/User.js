const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const comment = require("./Comment");

const UserMovieSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  title: { type: String, required: true },
  year: { type: Number, required: true },
  posterUrl: { type: String, required: true },
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  pictureUrl: { type: String },
  likedMovies: [UserMovieSchema],
  dislikedMovies: [UserMovieSchema],
  wishMovies: [UserMovieSchema],
  _id: { type: String, default: uuidv4 },
});

module.exports = mongoose.model("user", UserSchema);
