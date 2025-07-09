const mongoose = require("mongoose");

const linkRequestSchema = new mongoose.Schema({
  state: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now, expires: 300 },
});

module.exports = mongoose.model("LinkRequest", linkRequestSchema);
