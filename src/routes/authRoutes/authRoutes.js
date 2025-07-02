const express = require("express");
const router = express.Router();
const Auth = require("../../controllers/authController/authController");
const { protect } = require("../../helper/authMiddleware");

//Auth Routes
router.post("/register", Auth.register);
router.post("/login", Auth.login);
router.delete("/logout", protect, Auth.logout);
router.post("/forgot-password", Auth.forgotPassword);
router.post("/verify-otp", Auth.verifyOtp);
router.post("/reset-password", Auth.resetPassword);
router.delete("/delete-account", protect, Auth.deleteAccount);
router.put("/profile", protect, Auth.updateUserProfile);
router.put("/update-password", protect, Auth.updatePassword);
router.put("/notifications", protect, Auth.updateEmailNotification);

module.exports = router;
