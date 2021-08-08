const models = require("../models");
const validators = require("../utils/validators");

module.exports = {
  async getUserById(userId) {
    if (!validators.isNonEmptyString(userId))
      throw "Please provide a valid user ID";

    const user = await models.User.findById(userId).exec();
    if (!user) throw `There is no user with the given ID: ${userId}`;
    return user;
  },
  async createUser(name, email) {
    if (!validators.isLettersOnly(name))
      throw "User name must be provided and contains only letters";
    if (!validators.isValidEmail(email))
      throw "Please provide a valid email address";

    const newUser = new models.User({ name, email });
    const createdUser = await saveSafely(newUser);
    return createdUser;
  },

  async updateUser(id, name, email, pictureUrl) {
    if (!validators.isNonEmptyString(id))
      throw "Please provide a valid user ID";
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
  },

  async addMovieToUserList() {},

  async deleteUser(userId) {
    if (!validators.isNonEmptyString(userId))
      throw "Please provide a user ID to delete";
    const deletedUser = await models.User.findByIdAndDelete(userId).exec();
    return deletedUser;
  },
};

async function saveSafely(document) {
  try {
    return await document.save();
  } catch (e) {
    throw e.message;
  }
}
