const GeneratedPost = require("../../models/generatedPostModel/generatedPostModel");

// Save a new generated post
exports.saveGeneratedPost = async (req, res) => {
  const { userId, prompt, text, hashtags, imageUrl } = req.body;

  if (!userId || !prompt || !text) {
    return res.status(400).json({ error: "User ID, prompt, and text are required." });
  }

    try {
        const newPost = await GeneratedPost.create({
            userId,
            prompt,
            text,
            hashtags: hashtags || [],
            imageUrl: imageUrl || null,
        });

        res.status(201).json(newPost);
    } catch (error) {
        console.error("Error saving generated post:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get all generated posts
exports.getAllGeneratedPosts = async (req, res) => {
  const { userId } = req.query;

  try {
    const filter = userId ? { userId } : {};
    const posts = await GeneratedPost.find(filter).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching generated posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};






