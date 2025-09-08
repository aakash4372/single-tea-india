const Franchise = require("../model/Franchise");
const fs = require("fs").promises;
const path = require("path");

exports.getAllFranchises = async (req, res) => {
  try {
    const franchises = await Franchise.find();
    res.json(franchises);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getFranchiseById = async (req, res) => {
  try {
    const franchise = await Franchise.findById(req.params.id);
    if (!franchise)
      return res.status(404).json({ message: "Franchise not found" });
    res.json(franchise);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.createFranchise = async (req, res) => {
  try {
    let { title, contents, location_map_url } = req.body;
    if (typeof contents === "string") {
      contents = JSON.parse(contents);
    }
    const images_url = req.files
      ? req.files.map(
          (file) => `${process.env.SERVER_URL}/upload/franchise/${file.filename}`
        )
      : [];
    const franchise = await Franchise.create({ title, contents, images_url, location_map_url });
    res.status(201).json(franchise);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateFranchise = async (req, res) => {
  try {
    let { title, contents, location_map_url, images_url } = req.body;
    if (typeof contents === "string") {
      contents = JSON.parse(contents);
    }
    if (typeof images_url === "string") {
      images_url = JSON.parse(images_url);
    }

    // Get existing franchise
    const existingFranchise = await Franchise.findById(req.params.id);
    if (!existingFranchise) {
      return res.status(404).json({ message: "Franchise not found" });
    }

    // Delete old images not included in images_url
    const oldImages = existingFranchise.images_url || [];
    const imagesToDelete = oldImages.filter((url) => !images_url.includes(url));
    for (const url of imagesToDelete) {
      const filename = path.basename(url);
      const filePath = path.join(__dirname, "../Uploads/franchise", filename);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error(`Failed to delete image ${filename}:`, err.message);
      }
    }

    // Add new images
    const newImages = req.files
      ? req.files.map(
          (file) => `${process.env.SERVER_URL}/upload/franchise/${file.filename}`
        )
      : [];
    const updatedImagesUrl = [...images_url, ...newImages];

    const franchise = await Franchise.findByIdAndUpdate(
      req.params.id,
      { title, contents, location_map_url, images_url: updatedImagesUrl },
      { new: true }
    );

    if (!franchise) {
      return res.status(404).json({ message: "Franchise not found" });
    }

    res.json(franchise);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteFranchise = async (req, res) => {
  try {
    const franchise = await Franchise.findByIdAndDelete(req.params.id);
    if (!franchise) {
      return res.status(404).json({ message: "Franchise not found" });
    }

    // Delete associated images
    for (const url of franchise.images_url || []) {
      const filename = path.basename(url);
      const filePath = path.join(__dirname, "../Uploads/franchise", filename);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error(`Failed to delete image ${filename}:`, err.message);
      }
    }

    res.json({ message: "Franchise deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};