const usersData = require("../data/users");

async function authenticateUser(req, res) {
  if (!req.user) {
    res.status(403).json({
      error: "User must be logged in to perform this operation.",
    });
    return false;
  }
  return true;
}

async function authorizeUser(userId, req, res) {
  if (userId !== req.user._id) {
    res.status(403).json({
      error: "You must be the owner of the resource to perform this operation.",
    });
    return false;
  }
  return true;
}

module.exports = { authenticateUser, authorizeUser };
