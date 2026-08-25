const Quiz = require("../model/quiz");
const jwt = require("jsonwebtoken");

const User = require("../model/user");
const bcrypt = require("bcrypt");


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
