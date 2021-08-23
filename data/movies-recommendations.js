const { parentPort, workerData } = require("worker_threads");
const { likedMovies } = workerData;
const recommender = require("movie-recommender");
const { movies } = require(".");
const movielens = require("../data/movielens-api");

async function getRecommendations() {
  let recommendations = [];
  try {
    list = [];
    ids = [];
    for (let item of likedMovies) {
      list.push(item.title);
      ids.push(item.id);
    }

    let recs = await recommender.getRecommendations(list, 20);
    console.log(recs);

    recommendations = [];
    for (let rec of recs) {
      if (typeof rec !== "undefined" || res !== null) {
        let m = await movies.getMovieById(Number.parseInt(rec.movie.id));
        //let m = await movies.getMovieById(rec.movie.id);
        if (m) {
          //console.log(typeof rec.movie.id + ": " + rec.movie.id);
          recommendations.push(m);
        } else {
          m = await movielens.getSimilarMovies(rec.movie.id, 1);
          recommendations.concat(m);
        }
      }
    }
  } catch (e) {
    let m = await movielens.getSimilarMovies(ids[0], 20);
    recommendations = m;
  }
  parentPort.postMessage(recommendations);
}

getRecommendations();
