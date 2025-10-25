import express from "express";
import multer from "multer";
import path from "path";
import { upsertDoctorProfile, getDoctorProfile } from "../controllers/doctorProfileController.js";

const router = express.Router();

// Multer config for profile image
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/doctor_profiles/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Routes
router.post("/create", upload.single("profile_image"), upsertDoctorProfile);
router.get("/:custom_id", getDoctorProfile);

export default router;
