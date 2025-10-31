import { db } from "../db.js";

// Get all reminders for a user
export const getReminders = async (req, res) => {
  try {
    const { custom_id } = req.params;
    const [rows] = await db.execute(
      "SELECT * FROM medicine_reminders WHERE custom_id = ? ORDER BY reminder_time ASC",
      [custom_id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch reminders" });
  }
};

// Add new reminder
export const addReminder = async (req, res) => {
  try {
    const { custom_id, medicine_name, reminder_time, phone_number } = req.body;
    if (!custom_id || !medicine_name || !reminder_time || !phone_number)
      return res.status(400).json({ error: "Missing required fields" });

    await db.execute(
      "INSERT INTO medicine_reminders (custom_id, medicine_name, reminder_time, phone_number) VALUES (?, ?, ?, ?)",
      [custom_id, medicine_name, reminder_time, phone_number]
    );

    res.json({ success: true, message: "Reminder added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add reminder" });
  }
};

// Update status (e.g., mark as sent)
export const updateReminderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await db.execute("UPDATE medicine_reminders SET status = ? WHERE id = ?", [
      status,
      id,
    ]);
    res.json({ success: true, message: "Status updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update reminder status" });
  }
};
