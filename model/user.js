const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class User {
  constructor(
    id,
    name,
    email,
    password,
    verified,
    createdAt,
    quizCreated,
    active,
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.verified = verified;
    this.createdAt = createdAt;
    this.quizCreated = quizCreated;
    this.id = id;
    this.active = active;
  }

  createUser() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  static searchUserByEmail(email) {
    const db = getDb();
    db.collection("users").createIndex({ email: 1, active: 1 });
    return db.collection("users").findOne({
      email: email,
      active: true,
    });
  }

  static findById(id) {
    const db = getDb();
    return db.collection("users").findOne({
      _id: new mongodb.ObjectId(id),
      active: true,
    });
  }

  static saveToken(email, token, next30Days) {
    const db = getDb();
    return db.collection("users").updateOne(
      {
        email: email,
        active: true,
      },
      { $set: { resetToken: token, expireDate: next30Days } },
    );
  }

  static searchByToken(token) {
    const db = getDb();
    return db.collection("users").findOne({
      resetToken: token,
      active: true,
    });
  }

  static updateQuizCreated(id, quiz, verified) {
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(id) },
        { $set: { quizCreated: quiz, verified: verified } },
      );
  }

  static deleteRefreshToken(id) {
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(id) },
        { $set: { resetToken: null, expireDate: null } },
      );
  }

  static deleteUser(id) {
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(id) },
        { $set: { active: false } },
      );
  }

  static updateUser(id, name, email) {
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(id) },
        { $set: { name: name, email: email } },
      );
  }

  static updatePassword(password, userId) {
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(userId) },
        { $set: { password: password } },
      );
  }

  static getUserStats(userId) {
    const db = getDb();
    return db
      .collection("quiz")
      .aggregate([
        { $match: { userId: userId } },

        {
          $project: {
            subject: 1,
            _id: 1,
            date: 1,
            duration: 1,
            score: 1,
            totalQuestion: 1,
            time: 1,
            id: 1,
          },
        },
        {
          $group: {
            _id: null,
            quiz: { $push: "$$ROOT" },
            totalQuizCreated: { $sum: 1 },
            averageScore: { $avg: "$score" },
            totalTime: { $sum: "$duration" },
          },
        },
      ])
      .toArray();
  }

  static getSession(id) {
    const db = getDb();
    db.collection("sessions").createIndex({ userId: 1 });
    return db.collection("sessions").find({ userId: id }).toArray();
  }
}

module.exports = User;
