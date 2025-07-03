const passport = require("passport");
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const User = require("../models/userModel/userModel");

// Serialize user for session management
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session management
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// LinkedIn OAuth strategy configuration
passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL:"https://api.sociallens.kishankumardas.com/auth/linkedin/callback",
    //   callbackURL: "http://localhost:8000/auth/linkedin/callback",
      scope: ["r_liteprofile", "r_emailaddress", "w_member_social"],
      state: true,
      passReqToCallback: true, // IMPORTANT: to get `req`
    },

    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let user;

        // If user already logged in (typical use case)
        if (req.user) {
          user = await User.findById(req.user._id);
        } else if (profile.emails && profile.emails.length) {
          // Try to find by email
          user = await User.findOne({ email: profile.emails[0].value });
        }

        if (user) {
          user.accounts.linkedin = {
            id: profile.id,
            name: profile.displayName,
            url: profile._json.publicProfileUrl,
            connected: true,
            accessToken,
          };
          await user.save();
          return done(null, user);
        }

        // Else create new user
        const newUser = new User({
          name: profile.displayName,
          email: profile.emails?.[0]?.value,
          accounts: {
            linkedin: {
              id: profile.id,
              name: profile.displayName,
              url: profile._json.publicProfileUrl,
              connected: true,
              accessToken,
            },
          },
        });

        const savedUser = await newUser.save();
        return done(null, savedUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
