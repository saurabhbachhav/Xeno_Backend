// routes/nlToRules.js
const express = require("express");
const router = express.Router();
require("dotenv").config();
const { InferenceClient } = require("@huggingface/inference");

const client = new InferenceClient(process.env.HF_API_KEY);

router.post("/", async (req, res) => {
  const { prompt } = req.body;
  // console.log("🟡 Prompt received:", prompt);

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({
      error: "Prompt is required and must be a string",
    });
  }

  try {
    const systemPrompt = `
Convert the following natural language description into an array of rule objects.
Respond in valid JSON format like:
[
  { "field": "age", "operator": ">", "value": 25 },
  { "field": "spend", "operator": ">", "value": 5000 }
]

Description: ${prompt}
`;

    const chatCompletion = await client.chatCompletion({
      provider: "hf-inference",
      model: "mistralai/Mistral-7B-Instruct-v0.3",
      messages: [
        {
          role: "user",
          content: systemPrompt,
        },
      ],
    });

    const rawOutput = chatCompletion.choices?.[0]?.message?.content?.trim();
    // console.log("🔵 Model Output:", rawOutput);

    // Try to parse JSON response
    let rules;
    try {
      rules = JSON.parse(rawOutput);
    } catch (jsonErr) {
      console.warn("⚠️ Model did not return valid JSON:", jsonErr.message);
      return res.status(500).json({
        error: "Model did not return valid JSON",
        rawOutput,
      });
    }

    return res.json({ rules, promptUsed: prompt });
  } catch (error) {
    console.error("❌ Hugging Face API call failed:", error);
    return res.status(500).json({
      error: "Failed to convert prompt to rule",
      details: error.message,
    });
  }
});

module.exports = router;
