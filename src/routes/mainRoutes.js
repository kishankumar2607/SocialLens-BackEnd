const express = require("express");
const router = express.Router();
const Auth = require("./authRoutes/authRoutes");

router.use("/auth", Auth);


// router.use(
//   "/api",
// );

module.exports = router;
