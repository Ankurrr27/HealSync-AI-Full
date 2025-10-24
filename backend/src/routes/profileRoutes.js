import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { getProfile, upsertProfile } from "../controllers/profileController.js";

const router = express.Router();

// Ensure uploads folder exists
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

// Serve uploaded files statically
router.use("/uploads", express.static("uploads"));

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});

// Multer config
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) cb(null, true);
    else cb(new Error("Only JPEG, PNG, WEBP formats allowed"));
  }
});

// Routes
router.get("/:custom_id", getProfile); // Fetch or auto-create profile
router.post(
  "/:custom_id/update",
  upload.single("profile_image"),
  upsertProfile
); // Save or update profile

export default router;
