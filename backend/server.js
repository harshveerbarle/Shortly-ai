const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./db");
const urlRoutes = require("./routes/urlRoutes");
const summaryRoutes = require("./routes/summaryRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// URL Shortener API
app.use("/api/urls", urlRoutes);

// Short URL Redirect
app.use("/", urlRoutes);

// AI Text Summarizer API
app.use("/api/summarize", summaryRoutes);

// Home route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ShortlyAI backend is running!",
  });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// Start server after MongoDB connects
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`ShortlyAI server running at http://localhost:${PORT}`);
      console.log("URL Shortener: POST /api/urls/shorten");
      console.log("URL Redirect: GET /:shortCode");
      console.log("Text Summarizer: POST /api/summarize");
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();