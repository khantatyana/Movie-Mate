const movielens = require("movielens");
const validators = require("../utils/validators");

let cookie;

async function movieLensLogin() {
  cookie = await movielens.login(
    process.env.MOVIELENS_USERNAME,
    process.env.MOVIELENS_PASSWORD
  );
  console.log(`Logged in to Movielens successfully. Cookie: ${cookie}`);
}

movieLensLogin();

module.exports = {
  async queryMovies(query) {
    if (!query) return [];

    return await movielens.explore(cookie, query);
  },

  async getMovieById(movielensId) {
    if (!validators.isPositiveNumber(movielensId))
      throw "Please provide a valid MovieLens ID";

    return await movielens.get(cookie, `movies/${movielensId}`);
  },
};
