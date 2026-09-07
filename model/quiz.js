const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class Quiz {
  constructor(
    questions,
    userId,
    difficulty,
    duration,
    subject,
    date,
    time,
    id,
    answeredQuestions,
    score,
    timeTaken,
    fileType,
    totalQuestion,
  ) {
    this.questions = questions;
    this.userId = userId;
    this.difficulty = difficulty;
    this.duration = duration;
    this.subject = subject;
    this.date = date;
    this.time = time;
    this.id = id;
    this.answeredQuestions = answeredQuestions;
    this.score = score;
    this.timeTaken = timeTaken;
    this.fileType = fileType;
    this.totalQuestion = totalQuestion;
  }

  save() {
    const db = getDb();
    return db.collection("quiz").insertOne(this);
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

  static findById(id, userId) {
    const db = getDb();
    db.collection("quiz").createIndex({ id: 1 });
    return db.collection("quiz").findOne({ id: id, userId: userId });
  }

  static findAllQuiz(id) {
    const db = getDb();
    db.collection("quiz").createIndex({ userId: 1 });
    return db.collection("quiz").find({ userId: id }).pretty();
  }
}

module.exports = Quiz;
