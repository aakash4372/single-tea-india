const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    // Determine folder from URL
    let folder = "others";
    if (req.baseUrl.includes("menus")) folder = "menu";
    else if (req.baseUrl.includes("franchises")) folder = "franchise";
    else if (req.baseUrl.includes("franchise-gallery")) folder = "franchiseGallery";
    else if (req.baseUrl.includes("gallery")) folder = "gallery";

    const uploadPath = path.join(__dirname, "..", "upload", folder);

    // Ensure folder exists
    await fs.mkdir(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});

const upload = multer({ storage });

module.exports = upload;