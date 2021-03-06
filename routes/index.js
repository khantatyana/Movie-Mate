const moviesRoute = require("./movies");
const usersRoute = require("./users");

const routesSetup = (app) => {
  app.use("/api/movies", moviesRoute);
  app.use("/api/users", usersRoute);

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = routesSetup;
