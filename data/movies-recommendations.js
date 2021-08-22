const { parentPort, workerData } = require("worker_threads");
const { likedMovies } = workerData;
const recommender = require("movie-recommender");
const { movies } = require(".");
const movielens = require("../data/movielens-api");

async function getRecommendations() {
  let recommendations = [];
  //if (!routesUtils.authenticateUser(req, res)) return;
  try {
    // fetches list of user's liked movies
    let userId = req.user._id;
    let user = await users.getUserById(userId);
    let likedMovies = user.likedMovies;

    if (!likedMovies) res.json([]);

    list = [];
    ids = [];
    for (let item of likedMovies) {
      list.push(item.title);
      ids.push(item._id);
    }
    console.log(list);
    // generates list of recommendations (with movie titles)

    let recs = await recommender.getRecommendations(list, 20);
    // let recs = await recommender.getRecommendations(['Batman Begins', 'Jumanji', 'Capote'], 20);
    console.log(
      "================================================================"
    );
    console.log(recs);
    movieInfo = [];
    for (let rec of recs) {
      if (typeof rec !== "undefined" || res !== null) {
        // let m = await movies.getMovieById(Number.parseInt(rec.movie.id));
        let m = await movies.getMovieById(rec.movie.id);
        if (m) {
          //console.log(typeof rec.movie.id + ": " + rec.movie.id);
          movieInfo.push(m);
        } else {
          //m = await movielens.getSimilarMovies(rec.movie.id, 1)
          //movieInfo.concat(m);
        }
      }
    }
    console.log(
      "================================================================"
    );
    console.log(movieInfo);
    recommendations = movieInfo;
  } catch (e) {
    //let m = await movielens.getSimilarMovies(ids[0], 20)
    //recommendations = m
  }
  parentPort.postMessage(recommendations);
}

getRecommendations();
