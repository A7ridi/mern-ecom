const ErrorHandler = require("../utils/errorHandlers");

module.exports = (err, req, res, next) => {
  (err.statusCode = err.statusCode || 500),
    (err.message = err.message || "Internal server error");

  // mongodb error handling
  if (err.name === "CastError") {
    const msg = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(msg, 400);
  }

  res.status(err.statusCode).json({
    success: true,
    error: err,
    message: err.message,
  });
};
