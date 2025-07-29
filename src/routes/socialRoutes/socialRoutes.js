import express from "express";
import passport from "passport";
import { ensureLoggedIn } from "../middleware/authMiddleware";
const router = express.Router();

// 1) Kick off Facebook OAuth:
router.get("/facebook", ensureLoggedIn, passport.authenticate("facebook"));

// 2) Callback URL:
router.get(
	"/facebook/callback",
	passport.authenticate("facebook", {
		successRedirect: `${process.env.FRONTEND_URL}/settings?fb=success`,
		failureRedirect: `${process.env.FRONTEND_URL}/settings?fb=fail`,
	})
);

// 3) Unlink (disconnect) Facebook:
router.delete("/facebook", ensureLoggedIn, async (req, res) => {
	req.user.socialLinks.facebook = { connected: false };
	await req.user.save();
	res.json({ success: true });
});

// 4) Status check:
router.get("/status", ensureLoggedIn, (req, res) => {
	res.json({
		facebook: req.user.socialLinks.facebook.connected,
	});
});

export default router;
