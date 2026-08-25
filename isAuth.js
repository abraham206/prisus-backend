const jwt = require("jsonwebtoken");
const User = require("./model/user");

const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");

    if (!authHeader) {
      req.isAuth = false;
      const err = new Error("Authentication Required to access this!");
      err.statusCode = 401;
      throw err;
    }
    const token = authHeader.split(" ")[1];

    if (!token) {
      const error = new Error(
        "You are not logged In! Please log in to get access",
      );
      error.statusCode = 401;
      throw error;
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_CODE);

    const user = await User.findById(decoded.id);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 401;
      throw error;
    }

    req.user = new User(
      user._id,
      user.name,
      user.email,
      user.password,
      user.verified,
      user.createdAt,
      user.quizCreated,
    );

    req.isAuth = true;

    next();
  } catch (error) {
    req.isAuth = false;

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Access token has expired",
      });
    }

    return res.status(error.statusCode || 401).json({
      message: error.message || "You are not authenticated",
    });
  }
};

module.exports = isAuth;
