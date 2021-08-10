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
  async queryMovies(query, genre) {
    if (!query) return [];
    params = undefined;
    if (genre) {
      params = { genre };
    }

    return (await movielens.explore(cookie, query, params)).data;
  },

  async getMovieById(movielensId) {
    if (!validators.isPositiveNumber(movielensId))
      throw new "Please provide a valid MovieLens ID"();

    return (await movielens.get(cookie, `movies/${movielensId}`)).data;
  },
};
