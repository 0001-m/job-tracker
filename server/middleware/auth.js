const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // JWT is sent in the Authorization header as "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify the token — throws if expired or tampered
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user (minus password) to req so controllers can use it
      req.user = await User.findById(decoded.id).select('-password');

      next(); // token is valid, continue to the controller
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };