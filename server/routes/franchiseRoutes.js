const express = require("express");
const router = express.Router();
const franchiseController = require("../controllers/franchiseController");
const upload = require("../middleware/multer");

router.get("/", franchiseController.getAllFranchises);
router.get("/:id", franchiseController.getFranchiseById);
router.post("/", upload.array("images", 20), franchiseController.createFranchise);
router.put("/:id", upload.array("images", 20), franchiseController.updateFranchise);
router.delete("/:id", franchiseController.deleteFranchise);

module.exports = router;
