module.exports = (req, res, next) => {
  if (!req.user || !req.user.accounts.linkedin.connected) {
    return res.status(401).json({ error: "Not authenticated with LinkedIn" });
  }
  req.linkedinToken = req.user.accounts.linkedin.accessToken;
  req.linkedinUrn = `urn:li:person:${req.user.accounts.linkedin.id}`;
  next();
};
