const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = localStorage.getItem('token'); // Bearer token pattern

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No Token Provided' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or Expired Token' });
  }
};

module.exports = authMiddleware;
