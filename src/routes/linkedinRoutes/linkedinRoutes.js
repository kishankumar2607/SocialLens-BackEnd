const express = require("express");
const router = express.Router();
const asyncHandler = require("../../config/asyncHandler");
const requireLinkedIn = require("../../helper/requireLinkedIn");
const LinkedInController = require("../../controllers/linkedinController/linkedinController");
const jwtAuth = require("../../helper/jwtAuth");


// 1) Kick off the link flow.  Must be logged in (JWT cookie present).
router.get(
  "/",
  jwtAuth, // verify auth_token cookie → req.user
  asyncHandler(LinkedInController.redirectToLinkedIn)
);

// 2) Callback (no auth): LinkedIn posts back here
router.get("/callback", asyncHandler(LinkedInController.handleCallback));

// 3) All other endpoints: must be logged in AND have a linked LinkedIn account
router.get(
  "/posts",
  jwtAuth,
  requireLinkedIn,
  asyncHandler(LinkedInController.getPosts)
);

router.get(
  "/posts/:shareId/comments",
  jwtAuth,
  requireLinkedIn,
  asyncHandler(LinkedInController.getComments)
);

router.post(
  "/posts",
  jwtAuth,
  requireLinkedIn,
  asyncHandler(LinkedInController.createPost)
);

router.post(
  "/posts/:shareId/comments",
  jwtAuth,
  requireLinkedIn,
  asyncHandler(LinkedInController.createComment)
);

// 4) Unlink & revoke: also protected
router.delete(
  "/unlink",
  jwtAuth,
  requireLinkedIn,
  asyncHandler(LinkedInController.deleteAccount)
);

module.exports = router;
