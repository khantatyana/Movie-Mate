const { parentPort, workerData } = require("worker_threads");
const { likedMovies } = workerData;
const { getRecommendations } = require("movie-recommender");
const { movies } = require(".");

async function getRecommendations(likedMovies) {
  let recommendedMovies = await getRecommendations(likedMovies, 20);
  recommendedMovies = recommendedMovies.map((v) => {
    movies.getMovieById(v);
  });
  /* Mock data
  const recommendedMovies = [
    {
      _id: 246664,
      title: "Batman: Dying Is Easy",
      year: 2021,
      posterUrl: "/szcH4JUFQfL9jc26jETOepiq9NU.jpg",
    },
    {
      _id: 254460,
      title: "Jungle Cruise",
      year: 2021,
      posterUrl: "/9dKCd55IuTT5QRs989m9Qlb7d2B.jpg",
    },
    {
      _id: 233661,
      title: "The Courier",
      year: 2021,
      posterUrl: "/zFIjKtZrzhmc7HecdFXXjsLR2Ig.jpg",
    },
    {
      _id: 244334,
      title: "Wrath of Man",
      year: 2021,
      posterUrl: "/M7SUK85sKjaStg4TKhlAVyGlz3.jpg",
    },
  ];*/

  parentPort.postMessage(recommendedMovies);
}

getRecommendations();
