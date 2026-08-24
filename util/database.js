const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;
const mongoConnect = (callback) => {
  MongoClient.connect(
    `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.ynvhuoc.mongodb.net/prisus?retryWrites=true`,
  )
    .then((client) => {
      console.log("connected");
      _db = client.db();
    })
    .catch((err) => {
      const error = new Error(`Could not connect with the database`);
      error.statusCode = 500;
      throw error;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  const error = new Error(`no database forund`);
  error.statusCode = 404;
  throw error;
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
