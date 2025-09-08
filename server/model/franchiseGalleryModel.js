const mongoose = require("mongoose");

const franchiseGallerySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    maxlength: [100, "Name cannot exceed 100 characters"],
  },
  image_url: {
    type: String,
    required: [true, "Image URL is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("FranchiseGallery", franchiseGallerySchema);