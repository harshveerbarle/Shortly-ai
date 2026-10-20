const express = require("express");
const crypto = require("crypto");
const Url = require("../models/Url");

const router = express.Router();

// Create short URL
router.post("/shorten", async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({
        success: false,
        message: "Please provide a URL",
      });
    }

    let parsedUrl;

    try {
      parsedUrl = new URL(originalUrl);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid URL",
      });
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return res.status(400).json({
        success: false,
        message: "Only HTTP and HTTPS URLs are allowed",
      });
    }

    const shortCode = crypto.randomBytes(4).toString("hex");

    const savedUrl = await Url.create({
      originalUrl: parsedUrl.href,
      shortCode,
    });

    res.status(201).json({
      success: true,
      originalUrl: savedUrl.originalUrl,
      shortCode: savedUrl.shortCode,
      shortUrl: `http://localhost:${process.env.PORT || 5000}/${savedUrl.shortCode}`,
    });
  } catch (error) {
    console.error("Shorten error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to shorten URL",
    });
  }
});

// Redirect to original website
router.get("/:shortCode", async (req, res) => {
  try {
    const url = await Url.findOne({
      shortCode: req.params.shortCode,
    });

    if (!url) {
      return res.status(404).send("Short URL not found");
    }

    return res.redirect(302, url.originalUrl);
  } catch (error) {
    console.error("Redirect error:", error.message);

    return res.status(500).send("Server error");
  }
});

module.exports = router;