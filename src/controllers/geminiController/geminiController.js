const geminiModel = require("../../models/geminiModel/geminiModel");
const path = require("node:path");
const fs = require("node:fs").promises;

async function generateContent(req, res) {
  let { prompt } = req.body;

  if (!prompt) {
    return res
      .status(400)
      .json({ error: "Prompt is required in the request body." });
  }

  // Always append instructions for hashtags and image
  prompt = `${prompt}\n\nAt the end, include 5 relevant hashtags and generate an image that represents the topic.`;

  try {
    // Call the model to generate content
    const { text, hashtags, image } =
      await geminiModel.generateContentFromGemini(prompt);

    let imageUrl = null;
    if (image) {
      // Define the directory where images will be saved
      const uploadDir = path.join(__dirname, "..", "..", "public", "images");
      await fs.mkdir(uploadDir, { recursive: true });
      // Create a slug from the prompt (e.g., "eco friendly bottle" → "eco_friendly_bottle")
      const slug = prompt
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "") // remove special characters
        .replace(/\s+/g, "_") // replace spaces with underscores
        .substring(0, 40); // limit to 40 chars

      const timestamp = Date.now();
      const filename = `${slug}_${timestamp}.png`;

      const imagePath = path.join(uploadDir, filename);

      // Convert base64 string to a Buffer and save the image file
      const imageBuffer = Buffer.from(image, "base64");
      await fs.writeFile(imagePath, imageBuffer);

      // Construct the URL to access the saved image from the client
      imageUrl = `/images/${filename}`;
    }

    // Send a successful response with the generated content
    res.status(200).json({
      text: text,
      hashtags: hashtags,
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.error("Error in generateContent controller:", error);
    res.status(500).json({
      error:
        error.message ||
        "An unexpected error occurred during content generation.",
    });
  }
}

module.exports = {
  generateContent,
};
