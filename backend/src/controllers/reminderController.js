import { db } from "../db.js";
import twilio from "twilio";
import dotenv from "dotenv";
import cron from "node-cron";

dotenv.config();

// ✅ Twilio setup
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// ✅ Default WhatsApp number (Twilio Sandbox)
const TWILIO_WHATSAPP =
  process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";

// ✅ Get all reminders for a specific user
export const getReminders = async (req, res) => {
  try {
    const { custom_id } = req.params;
    const [rows] = await db.execute(
      "SELECT * FROM medicine_reminders WHERE custom_id = ? ORDER BY reminder_time ASC",
      [custom_id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching reminders:", err);
    res.status(500).json({ error: "Failed to fetch reminders" });
  }
};

// ✅ Add new reminder + send WhatsApp confirmation
export const addReminder = async (req, res) => {
  try {
    const { custom_id, medicine_name, reminder_time, phone_number } = req.body;

    if (!custom_id || !medicine_name || !reminder_time || !phone_number) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ Fix phone number format (ensure E.164)
    let formattedNumber = phone_number.trim().replace(/\s|-/g, "");
    if (!formattedNumber.startsWith("+")) {
      formattedNumber = "+91" + formattedNumber; // 🇮🇳 assume India if + not provided
    }

    console.log("📞 Formatted number:", formattedNumber);

    // ✅ Save reminder to DB
    await db.execute(
      "INSERT INTO medicine_reminders (custom_id, medicine_name, reminder_time, phone_number, status) VALUES (?, ?, ?, ?, 'pending')",
      [custom_id, medicine_name, reminder_time, formattedNumber]
    );

    // ✅ Send WhatsApp confirmation immediately
    try {
      await client.messages.create({
        from: TWILIO_WHATSAPP,
        to: `whatsapp:${formattedNumber}`,
        body: `💊 Reminder set for "${medicine_name}" at ${reminder_time}. We'll remind you on time.`,
      });
      console.log(`✅ WhatsApp confirmation sent to ${formattedNumber}`);
    } catch (err) {
      console.error("❌ WhatsApp confirmation failed:", err.message);
    }

    res.json({ success: true, message: "Reminder added successfully" });
  } catch (err) {
    console.error("Error adding reminder:", err);
    res.status(500).json({ error: "Failed to add reminder" });
  }
};

// ✅ Update reminder status (optional)
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
    console.error("Error updating reminder status:", err);
    res.status(500).json({ error: "Failed to update reminder status" });
  }
};

// ✅ CRON job: runs every minute to send due reminders
cron.schedule("* * * * *", async () => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM medicine_reminders WHERE status = 'pending' AND reminder_time <= NOW()"
    );

    for (const reminder of rows) {
      try {
        let formattedNumber = reminder.phone_number.trim();
        if (!formattedNumber.startsWith("whatsapp:")) {
          formattedNumber = `whatsapp:${formattedNumber}`;
        }

        await client.messages.create({
          from: TWILIO_WHATSAPP,
          to: formattedNumber,
          body: `⏰ It's time to take your medicine: ${reminder.medicine_name}`,
        });

        await db.query(
          "UPDATE medicine_reminders SET status = 'sent' WHERE id = ?",
          [reminder.id]
        );
        console.log(`✅ Reminder sent to ${formattedNumber}`);
      } catch (err) {
        console.error("❌ Failed to send WhatsApp reminder:", err.message);
      }
    }
  } catch (err) {
    console.error("Error running reminder cron job:", err);
  }
});
