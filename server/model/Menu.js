// models/Menu.js
const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    image_url: { type: String }, // Store path like "upload/menu/filename.jpg"
    content_text: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Menu", menuSchema);