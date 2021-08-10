const moviesRoute = require("./movies");
const usersRoute = require("./users");

const routesSetup = (app) => {
  app.use("/movies", moviesRoute);
  app.use("/users", usersRoute);

  app.use("*", (req, res) => {
    res.status(404).render("home/404", { title: "Page not found!" });
  });
};

module.exports = routesSetup;
