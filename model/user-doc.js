const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class Document {
  constructor(_id, name, type, time, userId, size, fileType) {
    this._id = _id;
    this.name = name;
    this.type = type;
    this.time = time;
    this.userId = userId;
    this.size = size;
    this.fileType = fileType;
  }

  save() {
    const db = getDb();
    return db.collection("documents").insertOne(this);
  }
  static getNumberDocs(userId) {
    const db = getDb();
    return db.collection("documents").countDocuments({ userId: userId });
    // return 10 + 10;
  }
  static getAllDocs(userId) {
    const db = getDb();
    return db
      .collection("documents")
      .find({ userId: userId })
      .sort({ time: -1 })
      .limit(5)
      .toArray();
  }
}

module.exports = Document;
