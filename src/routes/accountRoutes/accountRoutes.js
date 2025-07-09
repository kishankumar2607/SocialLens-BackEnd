const express = require("express");
const router = express.Router();
const AccountController = require("../../controllers/accountController/accountController");
const { protect } = require("../../helper/authMiddleware");

// GET all connected accounts for current user
router.get("/accounts", protect, AccountController.getConnectedAccounts);

// GET: LinkedIn account details
router.get("/accounts/linkedin", protect, AccountController.getLinkedInAccount);

// PUT: update one or more accounts
router.put("/accounts", protect, AccountController.updateConnectedAccounts);

// DELETE /api/:platform
router.delete(
  "/accounts/:platform",
  protect,
  AccountController.deleteConnectedAccount
);

module.exports = router;
