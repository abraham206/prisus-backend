const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class Session {
  constructor(
    userId,
    type,
    number,
    subject,
    date,
    time,
    score,
    fileType,
    typeId,
    timestamp,
  ) {
    this.userId = userId;
    this.type = type;
    this.subject = subject;
    this.date = date;
    this.time = time;
    this.score = score;
    this.fileType = fileType;
    this.number = number;
    this.typeId = typeId;
    this.timestamp = timestamp;
  }

  save() {
    const db = getDb();
    return db.collection("sessions").insertOne(this);
  }

  static getUserSession(userId) {
    const db = getDb();
    return db
      .collection("sessions")
      .find({ userId: userId })
      .sort({ timestamp: -1 })
      .toArray();
  }

  static updateSession(userId, typeId, score) {
    const db = getDb();
    return db
      .collection("sessions")
      .updateOne(
        { userId: userId, typeId: typeId },
        { $set: { score: score } },
      );
  }
}

module.exports = Session;
