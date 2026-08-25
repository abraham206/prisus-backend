const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../model/user");

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
      secure: false,
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
      console.log("no token");
      const err = new Error("You are not authenticated!");
      err.statusCode = 401;
      throw err;
    }

    if(token){
    console.log(token, "the token");
    const user = await User.searchByToken(token);
    if (!user) {
      console.log("no user");

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
  res.clearCookie("refreshToken");
  req.user = null;
  req.auth = false;
  res.status(201).json({ message: "logged out successfully" });
};
