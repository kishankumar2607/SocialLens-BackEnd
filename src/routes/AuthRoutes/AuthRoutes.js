const express = require("express");
const router = express.Router();
const auth = require("../../controllers/AuthController/AuthController");
const protect = require("../../helper/authMiddleware");

router.post("/register", auth.register);
router.post("/login", auth.login);
router.put("/update-profile", protect, auth.updateUser);
router.get("/change-password", protect, auth.changePassword);

module.exports = router;
