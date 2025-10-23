import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { getProfile, upsertProfile } from "../controllers/profileController.js";

const router = express.Router();

// Serve uploads
router.use("/uploads", express.static("uploads"));
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    allowed.test(ext) ? cb(null, true) : cb(new Error("Only JPEG, PNG, WEBP allowed"));
  }
});

// Routes
router.get("/:custom_id", getProfile); // Fetch or auto-create
router.post("/:custom_id/update", upload.single("profile_image"), upsertProfile); // Save/update

export default router;
