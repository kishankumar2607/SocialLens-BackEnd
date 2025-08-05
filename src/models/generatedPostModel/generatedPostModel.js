const mongoose = require("mongoose");

const generatedPostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  hashtags: [String],
  imageUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("GeneratedPost", generatedPostSchema);
