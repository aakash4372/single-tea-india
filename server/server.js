const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const franchiseRoutes = require("./routes/franchiseRoutes");
const menuRoutes = require("./routes/menuRoutes");
const franchiseGalleryRoutes = require("./routes/franchisegalleryRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const ContactRoutes = require("./routes/ContactRoute");
const ensureUploadFolder = require("./utils/setupFolder");
const path = require("path");

const app = express();

// Ensure upload folders exist
ensureUploadFolder("menu");
ensureUploadFolder("franchise");
ensureUploadFolder("franchiseGallery");
ensureUploadFolder("gallery");

// ================== MIDDLEWARE ==================

// Security
app.use(helmet());

// Logging
app.use(morgan("dev"));

// Body parser & cookies
app.use(express.json());
app.use(cookieParser());

// Unified CORS setup
const allowedOrigins = [process.env.CLIENT_URL, process.env.FRONTEND_URL];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Disposition"],
  })
);

// Static file serving
app.use(
  "/upload",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(__dirname, "upload"))
);

// Root route
app.get("/", (req, res) => {
  res.send("🚀 Single Tea India Backend is live!");
});

// ================== ROUTES ==================
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/franchises", franchiseRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/franchise-gallery", franchiseGalleryRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/conactemail", ContactRoutes);

// ================== START SERVER ==================
connectDB();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));