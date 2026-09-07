const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class Flashcard {
  constructor(
    userId,
    Flashcards,
    number,
    subject,
    date,
    time,
    fileType,
    FakeId,
  ) {
    this.userId = userId;
    this.flashcards = Flashcards;
    this.number = number;
    this.subject = subject;
    this.date = date;
    this.time = time;
    this.fileType = fileType;
    this.FakeId = FakeId;
  }

  save() {
    const db = getDb();
    return db.collection("flashcard").insertOne(this);
  }
  static findById(id, userId) {
    const db = getDb();
    db.collection("flashcard").createIndex({ typeId: 1 });
    return db.collection("flashcard").findOne({ FakeId: id, userId: userId });
  }

  static findAllFlashcard(id) {
    const db = getDb();
    db.collection("flashcard").createIndex({ userId: 1 });
    return db.collection("flashcard").countDocuments({ userId: id });
  }
}

module.exports = Flashcard;
