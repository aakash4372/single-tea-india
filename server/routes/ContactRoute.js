const express = require("express");
const router = express.Router();
const { submitFranchiseEnquiry } = require("../controllers/ContactEmail");

router.post("/enquiry", submitFranchiseEnquiry);

module.exports = router;