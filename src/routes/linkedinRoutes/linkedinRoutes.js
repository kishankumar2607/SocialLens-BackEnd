const express = require("express");
const router = express.Router();
const asyncHandler = require("../../config/asyncHandler");
const requireLinkedIn = require("../../helper/requireLinkedIn");
const LinkedInController = require("../../controllers/linkedinController/linkedinController");

// If you also have a generic "logged in" check:
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Not signed in" });
};

router.get("/", asyncHandler(LinkedInController.redirectToLinkedIn));

router.get("/callback", asyncHandler(LinkedInController.handleCallback));

router.get(
  "/posts",
  requireAuth,
  requireLinkedIn,
  LinkedInController.getPosts
);

router.get(
  "/posts/:shareId/comments",
  requireAuth,
  requireLinkedIn,
  LinkedInController.getComments
);

router.post(
  "/posts",
  requireAuth,
  requireLinkedIn,
  LinkedInController.createPost
);

router.post(
  "/posts/:shareId/comments",
  requireAuth,
  requireLinkedIn,
  LinkedInController.createComment
);

router.delete(
  "/unlink",
  requireAuth,
  requireLinkedIn,
  LinkedInController.deleteAccount
);

module.exports = router;
