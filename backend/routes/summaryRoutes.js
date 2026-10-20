const express = require("express");
const Groq = require("groq-sdk");

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/", async (req, res) => {
  try {
    const { text, length = "medium" } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide some text to summarize.",
      });
    }

    if (text.length > 20000) {
      return res.status(400).json({
        success: false,
        message: "Text must be 20,000 characters or less.",
      });
    }

    const lengthInstructions = {
      short: "Summarize in 2-3 sentences.",
      medium: "Summarize in 1-2 clear paragraphs.",
      detailed: "Provide a detailed summary with the main points.",
    };

    const instruction =
      lengthInstructions[length] || lengthInstructions.medium;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful text summarizer. Preserve the original meaning, include the important points, and do not invent facts.",
        },
        {
          role: "user",
          content: `${instruction}\n\nSummarize this text:\n\n${text}`,
        },
      ],
      temperature: 0.3,
    });

    const summary = completion.choices[0]?.message?.content?.trim();

    if (!summary) {
      throw new Error("The AI returned an empty summary.");
    }

    return res.json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error("Summarization error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to summarize text. Please try again.",
    });
  }
});

module.exports = router;