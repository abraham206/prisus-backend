const errorController = (err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  if (res.headersSent) {
    next(err);
  }

  let message = err.message;
  if (statusCode === 500) {
    message === "Something went wrong";
  }
  res.status(err.statusCode || 500).json({
    message: message,
    success: false,
  });
};

module.exports = errorController;
