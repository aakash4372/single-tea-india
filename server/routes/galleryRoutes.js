const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const {
  createGallery,
  getGalleries,
  getGallery,
  updateGallery,
  deleteGallery,
} = require("../controllers/galleryController");

router
  .route("/")
  .post(upload.single("image"), createGallery)
  .get(getGalleries);

router
  .route("/:id")
  .get(getGallery)
  .put(upload.single("image"), updateGallery)
  .delete(deleteGallery);

module.exports = router;