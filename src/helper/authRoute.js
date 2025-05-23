const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const secretKey = process.env.SECRET_KEY;

router.get("/get-token", (req, res) => {
  const user = {
    username: "guest",
  };

  const accessToken = jwt.sign(user, secretKey, { expiresIn: "1h" });

  res.json({ accessToken });
});

module.exports = router;
