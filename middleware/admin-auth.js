const jwt = require("jsonwebtoken");

function isAdmin(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.adminData = decodedToken;
    next();
  } catch (e) {
    return res.status(401).json({
      message: "Invalid or expired token",
      error: e,
    });
  }
}

module.exports = {
  isAdmin: isAdmin,
};
