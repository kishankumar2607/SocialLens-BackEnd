const axios = require("axios");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const User = require("../../models/userModel/userModel");
const LinkRequest = require("../../models/linkRequest/linkRequest");
const {
  USERINFO_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  CALLBACK_URL,
  AUTH_URL,
  TOKEN_URL,
  SCOPES,
} = require("../../config/linkedin");

const SECRET = process.env.SECRET_KEY;

//Redirect to LinkedIn with a fresh state
exports.redirectToLinkedIn = async (req, res, next) => {
  // console.log(">> cookies:", req.cookies);
  const rawJwt = req.cookies.auth_token;
  if (!rawJwt) return res.status(401).send("Not signed in");

  let payload;
  try {
    payload = jwt.verify(rawJwt, SECRET);
  } catch (err) {
    return res.status(401).send("Invalid auth token");
  }

  const state = uuidv4();
  await LinkRequest.create({ state, userId: payload.id });

  const params = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    redirect_uri: CALLBACK_URL,
    scope: SCOPES,
    state,
  });
  res.redirect(`${AUTH_URL}?${params}`);
};

//Handle callback & exchange code → token
exports.handleCallback = async (req, res, next) => {
  try {
    const { code, state } = req.query;
    if (!code || !state) {
      return res.status(400).send("Missing code or state");
    }

    // find & consume state
    const linkReq = await LinkRequest.findOne({ state });
    if (!linkReq) return res.status(403).send("Invalid or expired state");
    await linkReq.deleteOne();

    // exchange code → access token
    const tokenRes = await axios.post(
      TOKEN_URL,
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: CALLBACK_URL,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    const accessToken = tokenRes.data.access_token;
    if (!accessToken) {
      return res.status(500).send("No access token returned");
    }

    // fetch OIDC userinfo
    const profileRes = await axios.get(USERINFO_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const claims = profileRes.data;

    // console.log("LinkedIn claims:", claims);

    // link to user
    const user = await User.findById(linkReq.userId);
    if (!user) return res.status(404).send("User not found");

    user.accounts.linkedin = {
      id: claims.sub || "",
      name: claims.name || "",
      profileURL: "",
      connected: true,
      accessToken,
    };
    await user.save();

    // redirect home
    res.redirect(process.env.FRONTEND_URL || "http://localhost:3000/settings");
  } catch (err) {
    next(err);
  }
};

// GET /auth/linkedin/posts
exports.getPosts = async (req, res, next) => {
  try {
    const owner = encodeURIComponent(req.linkedinUrn);
    const { data } = await axios.get(
      `https://api.linkedin.com/v2/shares?q=owners&owners=${owner}`,
      { headers: { Authorization: `Bearer ${req.linkedinToken}` } }
    );
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// GET /auth/linkedin/posts/:shareId/comments
exports.getComments = async (req, res, next) => {
  try {
    const parent = encodeURIComponent(`urn:li:share:${req.params.shareId}`);
    const { data } = await axios.get(
      `https://api.linkedin.com/v2/comments?q=parent&parent=${parent}`,
      { headers: { Authorization: `Bearer ${req.linkedinToken}` } }
    );
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// POST /auth/linkedin/posts
exports.createPost = async (req, res, next) => {
  try {
    const body = {
      author: req.linkedinUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: req.body.text },
          shareMediaCategory: "NONE",
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    };
    const { data } = await axios.post(
      "https://api.linkedin.com/v2/ugcPosts",
      body,
      {
        headers: {
          Authorization: `Bearer ${req.linkedinToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
          "Content-Type": "application/json",
        },
      }
    );
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

// POST /auth/linkedin/posts/:shareId/comments
exports.createComment = async (req, res, next) => {
  try {
    const body = {
      actor: req.linkedinUrn,
      message: { text: req.body.text },
      object: `urn:li:share:${req.params.shareId}`,
    };
    const { data } = await axios.post(
      "https://api.linkedin.com/v2/comments",
      body,
      {
        headers: {
          Authorization: `Bearer ${req.linkedinToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
          "Content-Type": "application/json",
        },
      }
    );
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

// DELETE /auth/linkedin/unlink
exports.deleteAccount = async (req, res, next) => {
  try {
    const linkedIn = req.user.accounts.linkedin || {};
    const accessToken = linkedIn.accessToken;

    if (accessToken) {
      await axios.post(
        "https://www.linkedin.com/oauth/v2/revoke",
        new URLSearchParams({
          token: accessToken,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        }).toString(),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
    }
  } catch (err) {
    console.log(err);
  }

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user) {
      user.accounts.linkedin = {
        id: "",
        name: "",
        url: "",
        connected: false,
        accessToken: "",
      };

      await user.save();

      res.status(200).json({ message: "Account unlinked successfully" });
    }
  } catch (error) {
    console.log(error);
  }
};
