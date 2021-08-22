const { parentPort, workerData } = require("worker_threads");

const { likedMovies } = workerData;

async function getRecommendations() {
  /*** Start of mocking block, Call recommendation instead of this block. */
  console.log("Inside getRecommendations");
  await new Promise((resolve) => setTimeout(resolve, 30 * 1000)); // Just wait 1 min to simulate calculations

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
  ];
  /*** End of mocking block */

  parentPort.postMessage(recommendedMovies);
}

getRecommendations();
