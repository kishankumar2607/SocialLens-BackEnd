const express = require("express");
const router = express.Router();
const passport = require("passport");
const LinkedInController = require("../../controllers/linkedinController/linkedinController");

// Route to initiate LinkedIn OAuth flow
router.get("/linkedin", passport.authenticate("linkedin"));

// LinkedIn callback
router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/dashboard"); // after LinkedIn success
  }
);

// API endpoints for user
router.get("/linkedin/profile", LinkedInController.getLinkedInProfile);

// Get LinkedIn followers
router.get("/linkedin/followers", LinkedInController.getLinkedInFollowers);

// Post to LinkedIn feed
router.post("/linkedin/post", LinkedInController.createLinkedInPost);

module.exports = router;
