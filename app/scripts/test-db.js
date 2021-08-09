require("dotenv").config();
const db = require("../config/mongoConnection");
const { users, movies, movielens } = require("../data");

async function main() {
  await new Promise((r) => setTimeout(r, 2000));
  const conn = await db();
  conn.dropDatabase();

  const ayman = await users.createUser("Ayman Elkfrawy", "elkfrawy@gmail.com");
  const bgates = await users.createUser("Bill Gates", "bill@gates.com");

  const movie1 = await movies.getMovieById(1);
  const movie2 = await movies.getMovieById(2);

  await movies.addComment(
    movie1._id,
    ayman._id,
    ayman.name,
    "Love this movie!"
  );

  await users.updateUser(ayman._id, "Ayman F Elkfrawy", ayman.email);

  await users.addMovieToUserList(ayman._id, movie1._id, "likedMovies");
  await users.addMovieToUserList(ayman._id, movie2._id, "wishMovies");
  await users.addMovieToUserList(bgates._id, movie1._id, "dislikedMovies");
}

main();
