const express = require("express");
const router = express.Router();
const movies = require("../data/movies");
const { getUserById } = require("../data/users")
const routesUtils = require("./routes-utils");
const recommender = require("movie-recommender");
const redis = require('redis');
const client = redis.createClient();
/**
 * TODO: Import bluebird & redis
 */

const bluebird = require('bluebird')
const { argsToArgsConfig } = require('graphql/type/definition')

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

router.get("/", async (req, res) => {
    if (!routesUtils.authenticateUser(req, res)) return;

    let recCache = await client.getAsync('recCache')
    if(recCache) {
      let oldRecs = await client.getAsync('recs')
      res.json(JSON.parse(oldRecs))
    } else {
      let newRecs = getNewRecommendations(req.user.userId)
      client.setAsync('recs', JSON.stringify(newRecs))
      client.setAsync('recCache', true)
      res.json(newRecs)
    }
});

async function getNewRecommendations(userId) {
  let user = await getUserById(userId)
  // not sure exacy form in MongoDB
  likedMovies = user.likedMovies
  if(!likedMovies) return;

  likedMovies.map((v) => {
      v.title
  })

  // generates list of recommendations (with movie titles)
  let recs = await recommender(likedMovies, 20)
  movieInfo = []
  for(let rec of recs) {
      let m = movies.getMovieById(rec.id)
      movieInfo.push(m)
  }
  return movieInfo
}