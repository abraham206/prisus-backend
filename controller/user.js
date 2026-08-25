const Quiz = require("../model/quiz");
const jwt = require("jsonwebtoken");

const User = require("../model/user");
const bcrypt = require("bcrypt");
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const verified = false;
    const createdAt = Date.now();
    const date = new Date(createdAt);
    const month = date.getMonth();
    const day = date.getDay();
    const year = date.getFullYear();
    const quizCreated = [];
    const id = null;
    const active = true;
    const testUser = await User.searchUserByEmail(email);
    if (testUser) {
      const error = new Error("A user already exists with that email");
      error.statusCode = 409;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User(
      id,
      name,
      email,
      hashedPassword,
      verified,
      `${months[month]} ${day}, ${year}`,
      quizCreated,
      active,
    );
    const regUser = await user.createUser();

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
      .status(201)
      .json({ message: "createdSucessfully", user_doc: user, token: token });
    // search if user exists

    //
  } catch (error) {
    next(error);
  }
};

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
    res.status(201).json({ message: "Deleted Successfully" });
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
    const freshUser = await User.updateUser(req.user.id, name, email);
    res.status(201).json({ message: "Updated Successfully!" });
  } catch (error) {
    next(error);
  }
};

exports.changeUserPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      const err = new Error("User cannnot be found");
      err.statusCode = 401;
      throw err;
    }

    if (!oldPassword || !newPassword || !confirmPassword) {
      const err = new Error("All field must be filled up!!");
    }
    const isCorrect = await bcrypt.compare(oldPassword, user.password);

    if (!isCorrect) {
      const err = new Error("Password is not Correct!");
      err.statusCode = 401;
      throw err;
    }
    const password = await bcrypt.hash(newPassword, 12);
    const freshUser = await User.updatePassword(password);
    const token = jwt.sign(
      { email: freshUser.email, id: freshUser._id.toString() },
      process.env.ACCESS_TOKEN_CODE,
      { expiresIn: "30m" },
    );

    const refreshToken = jwt.sign(
      { email: freshUser.email, id: freshUser._id.toString() },
      process.env.REFRESH_TOKEN_CODE,
      { expiresIn: "30d" },
    );
    await User.saveToken(freshUser.email, refreshToken, next30days);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: false,
    });

    res
      .status(201)
      .json({ message: "Password Updated Successfully", token: token });
  } catch (error) {
    next(error);
  }
};
