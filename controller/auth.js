const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../model/user");
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

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const next30days = Date.now() + 30 * 24 * 60 * 60 * 1000;
    const user = await User.searchUserByEmail(email);
    if (!user) {
      const error = new Error("Could not find an account with that email!");
      error.statusCode = 404;
      throw error;
    }

    const isCorrect = await bcrypt.compare(password, user.password);

    if (!isCorrect) {
      const error = new Error("Invalid password");
      error.statusCode = 400;
      throw error;
    }
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

    res.status(200).json({ token: token });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      const err = new Error("You are not authenticated!");
      err.statusCode = 401;
      throw err;
    }

    if (token) {
      const user = await User.searchByToken(token);
      if (!user) {
        const err = new Error("You are not authenticated!");
        err.statusCode = 401;
        throw err;
      }

      if (user.expireDate <= Date.now()) {
        const err = new Error(
          "You are not authenticated, login to complete action",
        );
        err.statusCode = 401;
        throw err;
      }

      const newToken = jwt.sign(
        { email: user.email, id: user._id.toString() },
        process.env.ACCESS_TOKEN_CODE,
        { expiresIn: "30m" },
      );

      res.status(200).json({ token: newToken });
    }
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.clearCookie("refreshToken");
    req.user = null;
    req.auth = false;
    res.status(201).json({ message: "logged out successfully" });
  } catch (error) {
    next(error);
  }
};
