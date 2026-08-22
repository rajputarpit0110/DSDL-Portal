const ApiError = require('../utils/apiError');

const notFoundMiddleware = (req, res, next) => {
  const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
  next(error);
};

module.exports = notFoundMiddleware;
