// https://www.kaggle.com/rounakbanik/the-movies-dataset/data
// Exercise: Content-based - Include credits data with crew and cast too
// Exercise: Content-based - Make features weighted based on popularity or actors
// Exercise: Collaborative Filtering - Model-based CF with SVD

const fs = require('fs');
const csv = require('fast-csv')
const prepareMovies = require('./preparation/movies').prepareMovies
const predictWithContentBased = require('./strategies/contentBased').predictWithContentBased;
const getMovieIndexByTitle = require('./strategies/common').getMovieIndexByTitle;
var path = require('path');

let MOVIES_META_DATA = {};
let MOVIES_KEYWORDS = {};
let RATINGS = [];

let ME_USER_ID = 0;

let moviesMetaDataPromise = new Promise((resolve) =>
  fs
    .createReadStream(path.resolve( __dirname, "./data/movies_metadata.csv" ))
    .pipe(csv({ headers: true }))
    .on('data', fromMetaDataFile)
    .on('end', () => resolve(MOVIES_META_DATA)));

let moviesKeywordsPromise = new Promise((resolve) =>
  fs
    .createReadStream(path.resolve( __dirname, "./data/movies_metadata.csv" ))
    .pipe(csv({ headers: true }))
    .on('data', fromKeywordsFile)
    .on('end', () => resolve(MOVIES_KEYWORDS)));

function fromMetaDataFile(row) {
  MOVIES_META_DATA[row.id] = {
    id: row.id,
    adult: row.adult,
    budget: row.budget,
    genres: softEval(row.genres, []),
    homepage: row.homepage,
    language: row.original_language,
    title: row.original_title,
    overview: row.overview,
    popularity: row.popularity,
    studio: softEval(row.production_companies, []),
    release: row.release_date,
    revenue: row.revenue,
    runtime: row.runtime,
    voteAverage: row.vote_average,
    voteCount: row.vote_count,
  };
}

function fromKeywordsFile(row) {
  MOVIES_KEYWORDS[row.id] = {
    keywords: softEval(row.keywords, []),
  };
}

//console.log('Unloading data from files ... \n');

function shuffle(array) {
  var currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

async function getRecommendations(liked_movies, count) {
  let moviesMetaData = ''
  let moviesKeywords = ''
  moviesMetaData = await moviesMetaDataPromise.then(function(result) {
    return result
  })
  moviesKeywords = await moviesKeywordsPromise.then(function(result) {
    return result
  })
  
  /*
  When the number of liked movies exceeds [count], then
  - Shuffle liked movies
  - Generate recommendation for first [count] movies after shuffle (1 for each movie)

  When [count] exceeds the number liked movies, then
  - Divide [count] by # of liked movies and round up ([sub_count])
  - Go one movie at a time and generate [sub_count] recommendations
  - If there's a remainder, just generate [sub_count + remainder] recommendations for the first movie
  */
  const movieIdInfo = prepareMovies(moviesMetaData, moviesKeywords);
  let rec_list = []
  if(count <= liked_movies.length) {
    let sub_liked_movies = shuffle(liked_movies).slice(0,count)
    for(var ind in sub_liked_movies) {
      let rec = await Promise.all([
        movieIdInfo,
        sub_liked_movies[ind],
        2
      ]).then(init);
      rec_list = rec_list.concat(rec[1])
    }
    rec_list = shuffle(rec_list)
  } else {
    let sub_count = Math.ceil(count / liked_movies.length)
    let boost = 0
    let use_boost = false
    if(liked_movies.length % sub_count > 0) {
      boost = liked_movies.length % sub_count
      use_boost = true
    }
    let i = 0
    while(i < liked_movies.length) {
      if(!use_boost) {
        boost = 0
      } else {
        use_boost = false
      }
      let rec = await Promise.all([
        movieIdInfo,
        liked_movies[i],
        sub_count + boost
      ]).then(init);
      rec.shift()
      rec_list = rec_list.concat(rec)
      i++
    }
  }
  let movie_set = new Set(rec_list.slice(0,count))
  //console.log("Recommended movies:",Array.from(movie_set))
  //console.log(`List length: ${movie_set.size}`)
  return Array.from(movie_set)
}

function init([ movieIdInfo, title, count ]) {
  /* ------------ */
  //  Preparation //
  /* -------------*/
  let MOVIES_BY_ID = movieIdInfo.MOVIES_BY_ID
  let MOVIES_IN_LIST = movieIdInfo.MOVIES_IN_LIST
  ////console.log("MOVIES_IN_LIST:",MOVIES_IN_LIST)
  let X = movieIdInfo.X

  /* ------------------------- */
  //  Content-Based Prediction //
  //  Cosine Similarity Matrix //
  /* ------------------------- */

  const contentBasedRecommendation = predictWithContentBased(X, MOVIES_IN_LIST, title);
  return sliceAndDice(contentBasedRecommendation, MOVIES_BY_ID, count, false)
}

// Utility

function addUserRating(userId, searchTitle, rating, MOVIES_IN_LIST) {
  const { id, title } = getMovieIndexByTitle(MOVIES_IN_LIST, searchTitle);

  return {
    userId,
    rating,
    movieId: id,
    title
  };
}

function sliceAndDice(recommendations, MOVIES_BY_ID, count, onlyTitle) {
  recommendations = recommendations.filter(recommendation => MOVIES_BY_ID[recommendation.movieId]);

  recommendations = onlyTitle
    ? recommendations.map(mr => ({ title: MOVIES_BY_ID[mr.movieId].title, score: mr.score }))
    : recommendations.map(mr => ({ movie: MOVIES_BY_ID[mr.movieId], score: mr.score }));

  return recommendations
    .slice(0, count);
}

function softEval(string, escape) {
  if (!string) {
    return escape;
  }

  try {
    return eval(string);
  } catch (e) {
    return escape;
  }
}

module.exports = {
  getRecommendations
}