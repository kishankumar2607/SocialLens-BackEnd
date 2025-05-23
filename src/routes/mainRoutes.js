const express = require("express");
const router = express.Router();
const authenticate = require("../helper/authMiddleware");
const ContactForm = require("./contactRoutes/contactRoutes");
const AuthRoute = require("../helper/authRoute");

router.use("/auth", AuthRoute);

router.use(authenticate);

router.use(
  "/api",
  ContactForm,
);

module.exports = router;
