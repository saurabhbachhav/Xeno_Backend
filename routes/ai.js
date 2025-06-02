const express = require("express");
const router = express.Router();
require("dotenv").config();
const { InferenceClient } = require("@huggingface/inference");

const client = new InferenceClient(process.env.HF_API_KEY);

// ✅ Route: Generate promotional messages
router.post("/suggest-messages", async (req, res) => {
  const { goal } = req.body;

  if (!goal || typeof goal !== "string") {
    return res
      .status(400)
      .json({ error: "Goal is required and must be a string" });
  }

  const prompt = `
Generate 3 short and friendly promotional SMS messages for the following marketing goal:
"${goal}"

Respond only in a numbered list format like:
1. Message one
2. Message two
3. Message three
`;

  try {
    const response = await client.chatCompletion({
      model: "mistralai/Mistral-7B-Instruct-v0.3",
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.choices?.[0]?.message?.content || "";
    const messages = content
      .split("\n")
      .map((line) => line.replace(/^\d+[\).\s]?/, "").trim())
      .filter(Boolean);

    res.json({ messages });
  } catch (err) {
    console.error("🛑 Error generating messages:", err);
    res.status(500).json({ error: "Failed to generate messages." });
  }
});

// ✅ Route: Generate image prompt idea (not actual image)
// router.post("/suggest-image", async (req, res) => {
//   const { goal } = req.body;

//   if (!goal || typeof goal !== "string") {
//     return res
//       .status(400)
//       .json({ error: "Goal is required and must be a string" });
//   }

//   const prompt = `
// Given the marketing goal "${goal}", suggest a prompt for generating an eye-catching visual advertisement.
// Make it concise, specific, and DALL·E-compatible.
// Respond with only the image prompt text.
// `;

//   try {
//     const response = await client.chatCompletion({
//       model: "mistralai/Mistral-7B-Instruct-v0.3",
//       messages: [{ role: "user", content: prompt }],
//     });

//     const imagePrompt = response.choices?.[0]?.message?.content?.trim() || "";
//     res.json({ prompt: imagePrompt });
//   } catch (err) {
//     console.error("🛑 Error generating image prompt:", err);
//     res.status(500).json({ error: "Failed to generate image prompt." });
//   }
// });

module.exports = router;
