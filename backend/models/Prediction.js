const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 150
  },
  predicted_emotion: {
    type: String,
    required: true,
    enum: ['sadness', 'fear', 'happiness', 'anger', 'neutral', 'surprise', 'disgust']
  },
  probabilities: {
    sadness: { type: Number, min: 0, max: 1 },
    fear: { type: Number, min: 0, max: 1 },
    happiness: { type: Number, min: 0, max: 1 },
    anger: { type: Number, min: 0, max: 1 },
    neutral: { type: Number, min: 0, max: 1 },
    surprise: { type: Number, min: 0, max: 1 },
    disgust: { type: Number, min: 0, max: 1 }
  },
  confidence: {
    type: Number,
    default: 0,
    min: 0,
    max: 1
  },
  file: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add compound index for faster queries
predictionSchema.index({ username: 1, createdAt: -1 });

const Prediction = mongoose.model("Prediction", predictionSchema);

module.exports = Prediction;
