const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema({
  pH: Number,
  turbidity: Number,
  temperature: Number,
  predicted_quality: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Data", DataSchema);
