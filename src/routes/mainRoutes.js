const express = require("express");
const router = express.Router();
const Auth = require("./authRoutes/authRoutes");
const Contact = require("./contactRoutes/contactRoutes");
const Support = require("./supportRoutes/supportRoutes");
const Account = require("./accountRoutes/accountRoutes");

router.use("/auth", Auth);

router.use("/api", Contact, Support, Account);

module.exports = router;
