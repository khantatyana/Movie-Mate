const movielens = require("movielens");

let cookie;

movielens
  .login(process.env.MOVIELENS_USERNAME, process.env.MOVIELENS_PASSWORD)
  .then(function (c) {
    cookie = c;
  })
  .catch(function (err) {
    console.error(err);
  });

module.exports = {
  async queryMovies(query) {
    if (!query) return [];

    return await movielens.explore(cookie, query);
  },

  async getMovieById(movielensId) {
    if (!validators.isNonEmptyString(movielensId))
      throw "Please provide a valid MovieLens ID";

    return await movielens.get(cookie, `movies/${movielens}`);
  },
};
