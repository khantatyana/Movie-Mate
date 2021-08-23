const movielens = require("movielens");
const validators = require("../utils/validators");
const csv = require("csvtojson");

let cookie;

let moviesMap;

async function movieLensLogin() {
  cookie = await movielens.login(
    process.env.MOVIELENS_USERNAME,
    process.env.MOVIELENS_PASSWORD
  );
  console.log(`Logged in to Movielens successfully. Cookie: ${cookie}`);
}

async function getCookie() {
  if (!cookie) {
    await movieLensLogin();
  }
  return cookie;
}

async function getMoviesMap() {
  if (!moviesMap) {
    moviesMap = {};
    const links = await csv().fromFile("utils/links.csv");
    for (let row of links) {
      moviesMap[row.tmdbId] = row.movieId;
    }
  }
  return moviesMap;
}

module.exports = {
  async queryMovies(query) {
    if (!query) return [];
    return (await movielens.explore(await getCookie(), query)).data;
  },

  async getGenres() {
    const response = await movielens.getGenres(await getCookie());
    return Object.keys(response.data.numMoviesPerGenre);
  },

  async getMovieById(movielensId) {
    if (!validators.isPositiveNumber(movielensId))
      throw new "Please provide a valid MovieLens ID"();

    try {
      const movie = await movielens.get(
        await getCookie(),
        `movies/${movielensId}`
      );
      return movie.data;
    } catch (e) {
      if (e.response.status >= 400 && e.response.status < 500) {
        return undefined; // Didn't find such movie
      } else {
        throw e;
      }
    }
  },

  async getMovieLensId(tmdbId) {
    return (await getMoviesMap())[tmdbId];
  },

  async getSimilarMovies(movielensId, limit = -1) {
    if (!validators.isPositiveNumber(movielensId))
      throw new "Please provide a valid MovieLens ID"();

    let { data } = await movielens.get(
      await getCookie(),
      `movies/${movielensId}/similar`
    );
    let similarMovies = [];
    if (data && data.similarMovies && data.similarMovies.searchResults) {
      similarMovies = data.similarMovies.searchResults.map((m) => m.movie);
      if (limit > 0 && similarMovies.length > limit) {
        similarMovies = similarMovies.slice(0, limit);
      }
    }
    return similarMovies;
  },
};
