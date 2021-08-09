const mongoose = require("mongoose");
let _connection = undefined;

module.exports = async () => {
  if (!_connection) {
    await mongoose.connect(process.env.DATABASE_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    _connection = mongoose.connection;
  }
  return _connection;
};
