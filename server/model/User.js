// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }, // Add isAdmin field
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);