const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError');

const protect = (req, res, next) => {
  try {
    const token = req.cookies.dsdl_token;

    if (!token) {
      throw new ApiError(401, 'Not authorized, no token');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod');
    req.user = decoded; // { userId, role }
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      next(new ApiError(401, 'Not authorized, token expired'));
    } else if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(401, 'Not authorized, token failed'));
    }
  }
};

module.exports = { protect };
