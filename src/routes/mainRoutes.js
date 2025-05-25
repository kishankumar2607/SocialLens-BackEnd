const express = require("express");
const router = express.Router();
const Auth = require("./AuthRoutes/AuthRoutes");

router.use("/auth", Auth);


// router.use(
//   "/api",
// );

module.exports = router;
