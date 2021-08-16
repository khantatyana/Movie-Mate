const mongoose = require("mongoose");
let _connection = undefined;

module.exports = async () => {
  if (!_connection) {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/movie-mate",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }
    );
    _connection = mongoose.connection;
  }
  return _connection;
};
