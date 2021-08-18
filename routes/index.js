const moviesRoute = require("./movies");
const usersRoute = require("./users");
const recsRoute = require("./recommendations")

const routesSetup = (app) => {
  app.use("/movies", moviesRoute);
  app.use("/users", usersRoute);
  app.use("/recs", recsRoute)

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = routesSetup;
