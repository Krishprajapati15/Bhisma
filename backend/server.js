const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

// Initialize app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Data model
const Data = require("./models/Data");

// Route to save data and fetch predictions
app.post("/api/predict", async (req, res) => {
  const { features } = req.body;
  try {
    const response = await axios.post("http://localhost:5001/predict", {
      features,
    });
    const prediction = response.data.predicted_quality;

    const newData = new Data({
      pH: features[0],
      turbidity: features[1],
      temperature: features[2],
      predicted_quality: prediction,
    });
    await newData.save();

    res.json({ prediction, newData });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to process data" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
