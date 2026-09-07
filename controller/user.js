const Quiz = require("../model/quiz");
const jwt = require("jsonwebtoken");

const User = require("../model/user");
const bcrypt = require("bcrypt");
const Session = require("../model/session");
const Document = require("../model/user-doc");
const Flashcard = require("../model/flashcard");

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req?.user?.id);
    if (!user) {
      const err = new Error("Something went wrong, signin to try again");
      err.statusCode = 401;
      throw err;
    }
    res.status(201).json({
      message: "fetched successfully",
      user: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      const err = new Error("No User Found");
      err.statusCode = 401;
      throw err;
    }
    await User.deleteUser(id);
    res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    next(error);
  }
};

exports.editUser = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      const err = new Error("Could not find the User!");
      err.statusCode = 401;
      throw err;
    }
    await User.updateUser(req.user.id, name, email);
    res.status(200).json({ message: "Updated Successfully!" });
  } catch (error) {
    next(error);
  }
};

exports.changeUserPassword = async (req, res, next) => {
  try {
    const next30days = Date.now() + 30 * 24 * 60 * 60 * 1000;

    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      const err = new Error("User cannnot be found");
      err.statusCode = 401;
      throw err;
    }

    if (newPassword !== confirmPassword) {
      const err = new Error("Password does not match!!");
      err.statusCode = 400;
      throw err;
    }

    if (!oldPassword || !newPassword || !confirmPassword) {
      const err = new Error("All field must be filled up!!");
      err.statusCode = 400;
      throw err;
    }
    const isCorrect = await bcrypt.compare(oldPassword, user.password);

    if (!isCorrect) {
      const err = new Error("Password is not Correct!");
      err.statusCode = 401;
      throw err;
    }
    const password = await bcrypt.hash(newPassword, 12);
    await User.updatePassword(password, req.user.id);
    const token = jwt.sign(
      { email: user.email, id: user._id.toString() },
      process.env.ACCESS_TOKEN_CODE,
      { expiresIn: "30m" },
    );

    const refreshToken = jwt.sign(
      { email: user.email, id: user._id.toString() },
      process.env.REFRESH_TOKEN_CODE,
      { expiresIn: "30d" },
    );
    await User.saveToken(user.email, refreshToken, next30days);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: true,
    });

    res
      .status(200)
      .json({ message: "Password Updated Successfully", token: token });
  } catch (error) {
    next(error);
  }
};

exports.userDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userDashboard = await User.getUserStats(userId);
    const totalDocs = await Document.getNumberDocs(userId);
    const allDocs = await Document.getAllDocs(userId);

    res.status(200).json({
      message: "Fetched Successfully",
      data: {
        userStats: userDashboard,
        userDocs: allDocs,
        totalDocs: totalDocs,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserSession = async (req, res, next) => {
  try {
    const sessions = await Session.getUserSession(req.user.id);
    const numberOfFlashcards = await Flashcard.findAllFlashcard(req.user.id);

    if (sessions.length === 0 || !sessions) {
      const err = new Error("No session has been done by this user!");
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({
      message: "fetched Sucessfully",
      sessions: sessions,
      totalFlashcards: numberOfFlashcards,
    });
  } catch (error) {
    next(error);
  }
};
