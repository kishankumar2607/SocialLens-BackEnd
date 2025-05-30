const express = require("express");
const router = express.Router();
// const Auth = require("./authRoutes/authRoutes");
const Contact = require("./contactRoutes/contactRoutes");
const Support = require("./supportRoutes/supportRoutes");

// router.use("/auth", Auth);

router.use("/api", Contact, Support);

module.exports = router;
