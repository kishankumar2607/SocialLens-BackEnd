const express = require("express");
const router = express.Router();
const AccountController = require("../../controllers/accountController/accountController");
const { protect } = require("../../helper/authMiddleware");

// GET all connected accounts for current user
router.get("/accounts", protect, AccountController.getConnectedAccounts);

// GET: LinkedIn account details
router.get("/accounts/linkedin", protect, AccountController.getLinkedInAccount);

module.exports = router;
