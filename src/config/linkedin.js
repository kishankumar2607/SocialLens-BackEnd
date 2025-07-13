const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  AUTH_URL: "https://www.linkedin.com/oauth/v2/authorization",
  TOKEN_URL: "https://www.linkedin.com/oauth/v2/accessToken",
  USERINFO_URL: "https://api.linkedin.com/v2/userinfo",
  CLIENT_ID: process.env.LINKEDIN_CLIENT_ID,
  CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET,
  CALLBACK_URL: process.env.LINKEDIN_CALLBACK_URL,
  SCOPES: [
    "openid",
    "profile",
    "email",
    "w_member_social",
  ].join(" "),
};
