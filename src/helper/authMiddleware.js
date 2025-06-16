const jwt = require("jsonwebtoken");
const User = require("../models/userModel/userModel");
const secretKey = process.env.SECRET_KEY;

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, secretKey);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const stillValid = user.tokens.some((t) => t.token === token);
    if (!stillValid) {
      return res.status(401).json({ message: "Token has been revoked." });
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
