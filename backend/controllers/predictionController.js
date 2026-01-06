const FormData = require("form-data");
const fetch = require("node-fetch");
const fs = require("fs");
const Prediction = require("../models/Prediction");

// Predict Emotion Controller
exports.predictEmotion = async (req, res) => {
  const { username, name, age } = req.body;
  
  // Validation
  if (!username || !name || !age || !req.file) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const filePath = req.file.path;
  const filename = req.file.filename;

  const formData = new FormData();
  formData.append("file", fs.createReadStream(filePath));

  try {
    // Call Flask ML service
    const mlServiceUrl = process.env.ML_SERVICE_URL || "http://127.0.0.1:5000";
    const flaskResponse = await fetch(`${mlServiceUrl}/predict`, {
      method: "POST",
      body: formData,
      headers: formData.getHeaders(),
    });

    if (!flaskResponse.ok) {
      throw new Error(`Flask Server Error: ${flaskResponse.statusText}`);
    }

    const flaskData = await flaskResponse.json();

    // Calculate confidence (highest probability)
    const maxProbability = Math.max(...Object.values(flaskData.probabilities));
    
    // Save prediction to MongoDB
    const prediction = await new Prediction({
      username,
      name,
      age: parseInt(age),
      predicted_emotion: flaskData.emotion,
      probabilities: flaskData.probabilities,
      confidence: maxProbability,
      file: filename
    }).save();

    console.log(`✅ Emotion predicted for ${name}: ${flaskData.emotion} (${(maxProbability * 100).toFixed(1)}% confidence)`);

    // Clean up uploaded file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({
      ...flaskData,
      predictionId: prediction._id,
      confidence: maxProbability,
      timestamp: prediction.createdAt
    });
  } catch (error) {
    console.error("❌ Prediction Error:", error);
    
    // Clean up file on error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    res.status(500).json({ error: "Prediction service error" });
  }
};

// Get Reports Controller
exports.getReports = async (req, res) => {
  const { username } = req.query;
  
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const reports = await Prediction.find({ username }).sort({ createdAt: -1 });
    
    if (!reports.length) {
      return res.status(404).json({ error: "No reports found" });
    }

    // Calculate statistics
    const emotionCounts = {};
    let totalConfidence = 0;
    
    reports.forEach(report => {
      emotionCounts[report.predicted_emotion] = (emotionCounts[report.predicted_emotion] || 0) + 1;
      totalConfidence += report.confidence;
    });

    const mostCommonEmotion = Object.keys(emotionCounts).reduce((a, b) => 
      emotionCounts[a] > emotionCounts[b] ? a : b
    );

    const statistics = {
      totalReports: reports.length,
      averageConfidence: (totalConfidence / reports.length * 100).toFixed(1),
      emotionDistribution: emotionCounts,
      mostCommonEmotion
    };

    res.json({
      reports,
      statistics
    });
  } catch (error) {
    console.error("❌ Error fetching reports:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get User Statistics Controller
exports.getUserStats = async (req, res) => {
  const { username } = req.query;
  
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const User = require("../models/User");
    const totalReports = await Prediction.countDocuments({ username });
    const user = await User.findOne({ username });
    
    res.json({
      username,
      totalReports,
      memberSince: user?.createdAt || null
    });
  } catch (error) {
    console.error("❌ Error fetching user stats:", error);
    res.status(500).json({ error: "Server error" });
  }
};
