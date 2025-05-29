const express = require("express");
const router = express.Router();
const Auth = require("./authRoutes/authRoutes");
const ContactForm = require("./contactRoutes/contactRoutes");

router.use("/auth", Auth);

router.use("/api", ContactForm);

module.exports = router;
