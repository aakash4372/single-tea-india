const Gallery = require("../model/Gallery");
const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs").promises;

// @desc    Create a new gallery item
// @route   POST /api/gallery
// @access  Private
const createGallery = asyncHandler(async (req, res) => {
  const file = req.file;

  if (!file) {
    res.status(400);
    throw new Error("Image is required");
  }

  // Server-side file size validation
  if (file.size > 5 * 1024 * 1024) {
    res.status(400);
    throw new Error("File size exceeds 5MB limit");
  }

  const image_url = `/upload/gallery/${file.filename}`;

  const gallery = await Gallery.create({
    image_url,
  });

  res.status(201).json({
    success: true,
    data: gallery,
  });
});

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
const getGalleries = asyncHandler(async (req, res) => {
  const galleries = await Gallery.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    data: galleries,
  });
});

// @desc    Get single gallery item
// @route   GET /api/gallery/:id
// @access  Public
const getGallery = asyncHandler(async (req, res) => {
  const gallery = await Gallery.findById(req.params.id);

  if (!gallery) {
    res.status(404);
    throw new Error("Gallery item not found");
  }

  res.status(200).json({
    success: true,
    data: gallery,
  });
});

// @desc    Update gallery item
// @route   PUT /api/gallery/:id
// @access  Private
const updateGallery = asyncHandler(async (req, res) => {
  const gallery = await Gallery.findById(req.params.id);

  if (!gallery) {
    res.status(404);
    throw new Error("Gallery item not found");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("New image is required");
  }

  // Server-side file size validation
  if (req.file.size > 5 * 1024 * 1024) {
    res.status(400);
    throw new Error("File size exceeds 5MB limit");
  }

  // Delete old image
  if (gallery.image_url) {
    const oldImagePath = path.join(__dirname, "..", gallery.image_url);
    try {
      await fs.unlink(oldImagePath);
    } catch (err) {
      console.error(`Failed to delete old image: ${err.message}`);
    }
  }

  const image_url = `/upload/gallery/${req.file.filename}`;

  const updatedGallery = await Gallery.findByIdAndUpdate(
    req.params.id,
    { image_url },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: updatedGallery,
  });
});

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Private
const deleteGallery = asyncHandler(async (req, res) => {
  const gallery = await Gallery.findById(req.params.id);

  if (!gallery) {
    res.status(404);
    throw new Error("Gallery item not found");
  }

  // Delete associated image
  if (gallery.image_url) {
    const imagePath = path.join(__dirname, "..", gallery.image_url);
    try {
      await fs.unlink(imagePath);
    } catch (err) {
      console.error(`Failed to delete image: ${err.message}`);
    }
  }

  await gallery.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

module.exports = {
  createGallery,
  getGalleries,
  getGallery,
  updateGallery,
  deleteGallery,
};