import express from "express";
import {
  getReminders,
  addReminder,
  updateReminderStatus,
} from "../controllers/reminderController.js";

const router = express.Router();

router.get("/:custom_id", getReminders);
router.post("/", addReminder);
router.put("/:id/status", updateReminderStatus);

export default router;
