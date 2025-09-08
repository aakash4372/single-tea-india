const fs = require("fs").promises;
const path = require("path");

const ensureUploadFolder = async (folderName) => {
  const uploadPath = path.join(__dirname, "..", "upload", folderName);
  try {
    await fs.mkdir(uploadPath, { recursive: true });
    console.log(`✅ Upload folder ready: ${uploadPath}`);
  } catch (err) {
    console.error(`❌ Error creating folder ${folderName}:`, err.message);
  }
};

module.exports = ensureUploadFolder;
