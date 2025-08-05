const express = require("express");
const router = express.Router();
const Auth = require("./authRoutes/authRoutes");
const Contact = require("./contactRoutes/contactRoutes");
const Support = require("./supportRoutes/supportRoutes");
const Account = require("./accountRoutes/accountRoutes");
const LinkedIn = require("./linkedinRoutes/linkedinRoutes");
const GeneratePost = require("./geminiRoutes/geminiRoutes");
const GeneratedPostRoutes = require("./generatedPostRoutes/generatedPostRoutes");

router.use("/auth", Auth);

router.use("/auth/linkedin", LinkedIn);

router.use("/api", Contact, Support, Account, GeneratePost, GeneratedPostRoutes);

module.exports = router;
