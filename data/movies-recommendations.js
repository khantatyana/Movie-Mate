const { parentPort, workerData } = require("worker_threads");
const { likedMovies } = workerData;
const recommender = require("movie-recommender");
const movielens = require("../data/movielens-api");

async function getRecommendations() {
  const numberOfRec = 20;
  let recommendations = [];
  try {
    list = [];
    ids = [];
    for (let item of likedMovies) {
      list.push(item.title);
      ids.push(item.id);
    }

    let recs = await recommender.getRecommendations(list, numberOfRec * 2);
    console.log("Recommendation from Recommender module");

    recommendations = [];
    for (let rec of recs) {
      if (typeof rec !== "undefined" || res !== null) {
        let id = await movielens.getMovieLensId(Number.parseInt(rec.movie.id));
        if (id) {
          let m = await movielens.getMovieById(Number.parseInt(rec.movie.id));
          if (m && m.movieDetails && m.movieDetails.movie) {
            recommendations.push(m.movieDetails.movie);
            if (recommendations.length >= numberOfRec) {
              break;
            }
          }
        }
      }
    }
  } catch (e) {
    console.log("Recommendation from Similarity API: " + e);
    const recPerMovie =
      numberOfRec > ids.length ? Math.ceil(numberOfRec / ids.length) : 1;
    for (let mId of ids) {
      let m = await movielens.getSimilarMovies(mId, recPerMovie);
      recommendations = recommendations.concat(m);
    }
    if (recommendations.length > 0) {
      recommendations.slice(0, numberOfRec);
    }
  }
  parentPort.postMessage(recommendations);
}

getRecommendations();
