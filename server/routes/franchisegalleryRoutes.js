const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const {
  createFranchiseGallery,
  getFranchiseGalleries,
  getFranchiseGallery,
  updateFranchiseGallery,
  deleteFranchiseGallery,
} = require("../controllers/franchisegalleryController");

router
  .route("/")
  .post(upload.single("image"), createFranchiseGallery)
  .get(getFranchiseGalleries);

router
  .route("/:id")
  .get(getFranchiseGallery)
  .put(upload.single("image"), updateFranchiseGallery)
  .delete(deleteFranchiseGallery);

module.exports = router;