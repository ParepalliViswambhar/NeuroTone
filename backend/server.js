const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");
const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const predictionRoutes = require("./routes/predictionRoutes");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./middleware/logger");

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(logger);

// Serve static files (uploaded audio files)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/predictions", predictionRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Emotion AI Backend is running",
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Emotion AI API",
    version: "1.0.0",
    endpoints: {
      auth: {
        signup: "POST /api/auth/signup",
        login: "POST /api/auth/login"
      },
      predictions: {
        predict: "POST /api/predictions/predict",
        reports: "GET /api/predictions/reports",
        userStats: "GET /api/predictions/user-stats"
      },
      health: "GET /health"
    }
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start Flask ML Service as child process
let flaskProcess = null;

function startFlaskService() {
  const flaskPath = path.join(__dirname, "ml_service", "app.py");
  
  console.log("🤖 Starting Flask ML Service...");
  
  flaskProcess = spawn("python", [flaskPath], {
    cwd: path.join(__dirname, "ml_service")
  });

  flaskProcess.stdout.on("data", (data) => {
    console.log(`[Flask] ${data.toString().trim()}`);
  });

  flaskProcess.stderr.on("data", (data) => {
    console.error(`[Flask Error] ${data.toString().trim()}`);
  });

  flaskProcess.on("close", (code) => {
    console.log(`[Flask] Process exited with code ${code}`);
  });

  flaskProcess.on("error", (error) => {
    console.error(`[Flask] Failed to start: ${error.message}`);
    console.error("⚠️  Make sure Python is installed and in your PATH");
  });
}

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down gracefully...");
  
  if (flaskProcess) {
    console.log("🛑 Stopping Flask ML Service...");
    flaskProcess.kill();
  }
  
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Shutting down gracefully...");
  
  if (flaskProcess) {
    console.log("🛑 Stopping Flask ML Service...");
    flaskProcess.kill();
  }
  
  process.exit(0);
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("╔════════════════════════════════════════╗");
  console.log("║   🚀 Emotion AI Backend Server       ║");
  console.log("╚════════════════════════════════════════╝");
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
  console.log(`📊 MongoDB: emotionAI database`);
  console.log(`🔐 Password encryption: bcrypt enabled`);
  console.log("════════════════════════════════════════");
  
  // Start Flask service after Node server is ready
  setTimeout(() => {
    startFlaskService();
  }, 1000);
});

module.exports = app;
