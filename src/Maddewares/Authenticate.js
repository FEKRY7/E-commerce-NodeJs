const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (verify && verify.role === 'admin') {
      req.user = verify;
      next();
    } else {
      res.status(403).json({ message: 'Unauthorized: pleas login as Admin' });
    }
  } catch (error) {
    res.status(403).json({ message: 'Authentication failed' });
  }
};

module.exports = auth;
