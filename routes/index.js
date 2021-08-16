const moviesRoute = require("./movies");
const usersRoute = require("./users");

const routesSetup = (app) => {
  app.use("/movies", moviesRoute);
  app.use("/users", usersRoute);

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = routesSetup;
