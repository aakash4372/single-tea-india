const FranchiseGallery = require("../model/franchiseGalleryModel");
const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs").promises;

// @desc    Create a new franchise gallery item
// @route   POST /api/franchise-gallery
// @access  Private
const createFranchiseGallery = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const file = req.file;

  if (!name || !file) {
    res.status(400);
    throw new Error("Name and image are required");
  }

  const image_url = `/upload/franchiseGallery/${file.filename}`;

  const franchiseGallery = await FranchiseGallery.create({
    name,
    image_url,
  });

  res.status(201).json({
    success: true,
    data: franchiseGallery,
  });
});

// @desc    Get all franchise gallery items
// @route   GET /api/franchise-gallery
// @access  Public
const getFranchiseGalleries = asyncHandler(async (req, res) => {
  const franchiseGalleries = await FranchiseGallery.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    data: franchiseGalleries,
  });
});

// @desc    Get single franchise gallery item
// @route   GET /api/franchise-gallery/:id
// @access  Public
const getFranchiseGallery = asyncHandler(async (req, res) => {
  const franchiseGallery = await FranchiseGallery.findById(req.params.id);

  if (!franchiseGallery) {
    res.status(404);
    throw new Error("Franchise gallery item not found");
  }

  res.status(200).json({
    success: true,
    data: franchiseGallery,
  });
});

// @desc    Update franchise gallery item
// @route   PUT /api/franchise-gallery/:id
// @access  Private
const updateFranchiseGallery = asyncHandler(async (req, res) => {
  const franchiseGallery = await FranchiseGallery.findById(req.params.id);

  if (!franchiseGallery) {
    res.status(404);
    throw new Error("Franchise gallery item not found");
  }

  const { name } = req.body;
  let updateFields = { name };

  if (req.file) {
    // Delete old image if it exists
    if (franchiseGallery.image_url) {
      const oldImagePath = path.join(
        __dirname,
        "..",
        franchiseGallery.image_url
      );
      try {
        await fs.unlink(oldImagePath);
      } catch (err) {
        console.error(`Failed to delete old image: ${err.message}`);
      }
    }
    updateFields.image_url = `/upload/franchiseGallery/${req.file.filename}`;
  }

  const updatedFranchiseGallery = await FranchiseGallery.findByIdAndUpdate(
    req.params.id,
    updateFields,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: updatedFranchiseGallery,
  });
});

// @desc    Delete franchise gallery item
// @route   DELETE /api/franchise-gallery/:id
// @access  Private
const deleteFranchiseGallery = asyncHandler(async (req, res) => {
  const franchiseGallery = await FranchiseGallery.findById(req.params.id);

  if (!franchiseGallery) {
    res.status(404);
    throw new Error("Franchise gallery item not found");
  }

  // Delete associated image
  if (franchiseGallery.image_url) {
    const imagePath = path.join(__dirname, "..", franchiseGallery.image_url);
    try {
      await fs.unlink(imagePath);
    } catch (err) {
      console.error(`Failed to delete image: ${err.message}`);
    }
  }

  await franchiseGallery.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

module.exports = {
  createFranchiseGallery,
  getFranchiseGalleries,
  getFranchiseGallery,
  updateFranchiseGallery,
  deleteFranchiseGallery,
};