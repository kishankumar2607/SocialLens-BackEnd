const jwt = require("jsonwebtoken");
const User = require("../models/userModel/userModel");
const SECRET = process.env.SECRET_KEY;

module.exports = async function jwtAuth(req, res, next) {
  try {
    // pull the raw JWT from the cookie
    const token = req.cookies.auth_token;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ error: "Not signed in" });
    }

    let payload;
    try {
      payload = jwt.verify(token, SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Invalid auth token" });
    }

    // fetch the user
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
