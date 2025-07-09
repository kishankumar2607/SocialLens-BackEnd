const jwt = require("jsonwebtoken");
const User = require("../models/userModel/userModel");
const SECRET  = process.env.SECRET_KEY;

module.exports = async function jwtAuth(req, res, next) {
  try {
    // 1) pull the raw JWT from the cookie
    const token = req.cookies.auth_token;
    if (!token) {
      return res.status(401).json({ error: "Not signed in" });
    }

    // 2) verify it
    let payload;
    try {
      payload = jwt.verify(token, SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Invalid auth token" });
    }

    // 3) fetch the user
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // 4) attach to req.user and continue
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
