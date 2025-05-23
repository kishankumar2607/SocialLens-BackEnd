const jwt = require("jsonwebtoken");

const secretKey = process.env.SECRET_KEY;

const authenticate = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ error: "Unauthorized - Access Token Missing" });
  }

  jwt.verify(
    token.replace("Bearer ", ""),
    process.env.SECRET_KEY,
    (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ error: "Unauthorized - Invalid Access Token" });
      }

      req.user = decoded;
      next();
    }
  );
};

module.exports = authenticate;
