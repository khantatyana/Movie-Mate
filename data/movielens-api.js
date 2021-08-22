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
    return (await movielens.explore(cookie, query)).data;
  },

  async getGenres() {
    const response = await movielens.getGenres(cookie);
    return Object.keys(response.data.numMoviesPerGenre);
  },

  async getMovieById(movielensId) {
    if (!validators.isPositiveNumber(movielensId))
      throw new "Please provide a valid MovieLens ID"();

    try {
      const movie = await movielens.get(cookie, `movies/${movielensId}`);
      return movie.data;
    } catch (e) {
      if (e.response.status >= 400 && e.response.status < 500) {
        return undefined; // Didn't find such movie
      } else {
        throw e;
      }
    }
  },

  async getSimilarMovies(movielensId, limit = -1) {
    if (!validators.isPositiveNumber(movielensId))
      throw new "Please provide a valid MovieLens ID"();

    let { data } = await movielens.get(cookie, `movies/${movielensId}/similar`);
    let similarMovies = [];
    if (data && data.similarMovies && data.similarMovies.searchResults) {
      similarMovies = data.similarMovies.searchResults;
      if (limit > 0 && similarMovies.length > limit) {
        similarMovies = similarMovies.slice(0, limit);
      }
    }
    return similarMovies;
  },
};
