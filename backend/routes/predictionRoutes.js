const express = require("express");
const router = express.Router();
const predictionController = require("../controllers/predictionController");
const upload = require("../config/multer");

// POST /api/predictions/predict
router.post("/predict", upload.single("file"), predictionController.predictEmotion);

// GET /api/predictions/reports
router.get("/reports", predictionController.getReports);

// GET /api/predictions/user-stats
router.get("/user-stats", predictionController.getUserStats);

module.exports = router;
