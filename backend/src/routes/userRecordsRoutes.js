import express from "express";
import multer from "multer";
import { uploadRecord, getRecords } from "../controllers/userRecordsController.js";

const router = express.Router();

// Multer setup for file uploads with size limit
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB max

// Routes
router.post("/:custom_id/upload", upload.single("file"), uploadRecord);
router.get("/:custom_id", getRecords);

export default router;
