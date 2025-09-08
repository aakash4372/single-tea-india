const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  image_url: {
    type: String,
    required: [true, "Image URL is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Gallery", gallerySchema);