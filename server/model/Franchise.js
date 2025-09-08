// models/Franchise.js
const mongoose = require("mongoose");

const franchiseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    contents: [
      {
        heading: { type: String, trim: true },
        content: { type: String, trim: true },
      },
    ],
    images_url: { type: [String] },
    location_map_url: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Franchise", franchiseSchema);