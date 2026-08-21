const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    const token = req.cookies.dsdl_token;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod');
    req.user = decoded; // { userId, role }
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };
