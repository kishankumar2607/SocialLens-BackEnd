
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const fs = require("node:fs").promises;

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error(
    "GEMINI_API_KEY not found in .env file. Please create a .env file with your API key."
  );
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-preview-image-generation",
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 2000,
    responseModalities: ["IMAGE", "TEXT"],
  },
});

async function generateContentFromGemini(prompt) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;

    let generatedText = "";
    let generatedImageBase64 = null;

    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        generatedText += part.text;
      } else if (
        part.inlineData &&
        part.inlineData.mimeType.startsWith("image/")
      ) {
        generatedImageBase64 = part.inlineData.data;
      }
    }

    const hashtagRegex = /#(\w+)/g;
    const matches = generatedText.match(hashtagRegex);
    const generatedHashtags = matches ? matches.map((tag) => tag.slice(1)) : [];

    return {
      text: generatedText,
      hashtags: generatedHashtags,
      image: generatedImageBase64,
    };
  } catch (error) {
    console.error("Error generating content from Gemini API:", error);
    throw new Error(
      "Failed to generate content from AI. Please try again later."
    );
  }
}

module.exports = {
  generateContentFromGemini,
};
