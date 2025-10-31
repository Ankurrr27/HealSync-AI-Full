import express from "express";
import {
  getReminders,
  addReminder,
  updateReminderStatus,
} from "../controllers/reminderController.js";

const router = express.Router();

// Get all reminders for a user
router.get("/:custom_id", getReminders);

// Add a new reminder
router.post("/", addReminder);

// Update reminder status
router.put("/:id/status", updateReminderStatus);

export default router; // ✅ Important: default export for ES modules
