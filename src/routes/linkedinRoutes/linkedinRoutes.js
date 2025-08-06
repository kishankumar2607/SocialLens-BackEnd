const express = require("express");
const router = express.Router();
const asyncHandler = require("../../config/asyncHandler");
const requireLinkedIn = require("../../helper/requireLinkedIn");
const LinkedInController = require("../../controllers/linkedinController/linkedinController");
const jwtAuth = require("../../helper/jwtAuth");
const upload = require("../../config/multer");

// Kick off the link flow.  Must be logged in (JWT cookie present).
router.get(
  "/",
  jwtAuth, // verify auth_token cookie → req.user
  asyncHandler(LinkedInController.redirectToLinkedIn)
);

// Callback (no auth): LinkedIn posts back here
router.get("/callback", asyncHandler(LinkedInController.handleCallback));

router.post(
  '/posts',
  jwtAuth,
  requireLinkedIn,
  LinkedInController.createPost
);

// 4) Unlink & revoke: also protected
router.delete(
  "/unlink",
  jwtAuth,
  requireLinkedIn,
  asyncHandler(LinkedInController.deleteAccount)
);

module.exports = router;
