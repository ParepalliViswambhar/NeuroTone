const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const FormData = require("form-data");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

mongoose.connect("mongodb://127.0.0.1:27017/authDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));


const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model("User", userSchema, "new1");


const predictionSchema = new mongoose.Schema({
  username: String,
  name: String,
  age: String,
  predicted_emotion: String,
  probabilities: Object,
  file: String, 
});
const Prediction = mongoose.model("Prediction", predictionSchema, "predictions");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username and password required" });

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "Username already exists" });

    await new User({ username, password }).save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });
    if (user) res.status(200).json({ message: "Login successful", username });
    else res.status(400).json({ message: "Invalid credentials" });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/predict", upload.single("file"), async (req, res) => {
  const { username, name, age } = req.body;
  if (!username || !name || !age || !req.file) return res.status(400).json({ error: "All fields are required" });

  const filePath = req.file.path;
  const filename = req.file.filename; 

  const formData = new FormData();
  formData.append("file", fs.createReadStream(filePath));

  try {
    const flaskResponse = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      body: formData,
      headers: formData.getHeaders(),
    });

    if (!flaskResponse.ok) throw new Error(`Flask Server Error: ${flaskResponse.statusText}`);

    const flaskData = await flaskResponse.json();

    await new Prediction({
      username,
      name,
      age,
      predicted_emotion: flaskData.emotion,
      probabilities: flaskData.probabilities,
      file: filename, 
    }).save();

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath); 

    res.json(flaskData);
  } catch (error) {
    console.error("Prediction Error:", error);
    res.status(500).json({ error: "Flask Server Error" });
  }
});
app.get("/reports", async (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: "Username is required" });

  try {
    const reports = await Prediction.find({ username });
    if (!reports.length) return res.status(404).json({ error: "No reports found" });

    res.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Server error" });
  }
});
app.listen(8000, () => {
  console.log("Server running on port 8000");
});
