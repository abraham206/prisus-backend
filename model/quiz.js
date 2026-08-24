const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class Quiz {
  constructor(
    questions,
    userId,
    difficulty,
    duration,
    name,
    date,
    time,
    id,
    answeredQuestions,
    score,
    timeTaken,
    fileType,
  ) {
    this.questions = questions;
    this.userId = userId;
    this.difficulty = difficulty;
    this.duration = duration;
    this.name = name;
    this.date = date;
    this.time = time;
    this.id = id;
    this.answeredQuestions = answeredQuestions;
    this.score = score;
    this.timeTaken = timeTaken;
    this.fileType = fileType;
  }

  save() {
    const db = getDb();
    db.collection("quiz").insertOne(this);
  }

  static updateByQuizId(id, answeredQuestions, score, timeTaken) {
    const db = getDb();
    return db.collection("quiz").updateOne(
      { id: id },
      {
        $set: {
          answeredQuestions: answeredQuestions,
          score: score,
          timeTaken: timeTaken,
        },
      },
    );
  }

  static findById(id) {
    const db = getDb();
    return db.collection("quiz").findOne({ id: id });
  }
}

module.exports = Quiz;
