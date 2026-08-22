const ApiError = require('../utils/apiError');

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Forbidden: Insufficient privileges'));
    }
    next();
  };
};

module.exports = { requireRole };
