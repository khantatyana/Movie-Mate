const mongoose = require("mongoose");
const comment = require("./Comment");

const MovieSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  title: { type: String, required: true },
  year: { type: Number, required: true },
  posterUrl: { type: String, required: true },
  comments: [comment.schema],
});

module.exports = mongoose.model("movie", MovieSchema);
