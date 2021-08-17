const getCosineSimilarityRowVector = require('./common').getCosineSimilarityRowVector
const sortByScore = require('./common').sortByScore
const getMovieIndexByTitle = require('./common').getMovieIndexByTitle

function predictWithContentBased(X, MOVIES_IN_LIST, title) {
  const { index } = getMovieIndexByTitle(MOVIES_IN_LIST, title);

  // Compute similarities based on input movie
  const cosineSimilarityRowVector = getCosineSimilarityRowVector(X, index);

  // Enrich the vector to convey all information
  // Use references from before which we kept track of
  const contentBasedRecommendation = cosineSimilarityRowVector
    .map((value, key) => ({
      score: value,
      movieId: MOVIES_IN_LIST[key].id,
    }));

  return sortByScore(contentBasedRecommendation);
}

module.exports = {
  predictWithContentBased
};