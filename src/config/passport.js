const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/userModel/userModel");

passport.use(
	new FacebookStrategy(
		{
			clientID: process.env.FACEBOOK_APP_ID,
			clientSecret: process.env.FACEBOOK_APP_SECRET,
			callbackURL: "http://localhost:8000/auth/facebook/callback",
			profileFields: ["id", "displayName", "emails"],
			enableProof: true,
		},
		async function (accessToken, refreshToken, profile, done) {
			// Find or create user and save Facebook token
			try {
				let user = await User.findOne({ email: profile.emails[0].value });
				if (!user) {
					// register new user or prompt to use existing registration flow
					return done(null, false, { message: "Please register first!" });
				}
				user.accounts.facebook = {
					connected: true,
					accessToken,
					userId: profile.id,
				};
				await user.save();
				return done(null, user);
			} catch (err) {
				return done(err, false);
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user.id); // Or user._id if using MongoDB
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id);
		done(null, user);
	} catch (err) {
		done(err, null);
	}
});

module.exports = passport;
