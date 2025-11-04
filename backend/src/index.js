import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// 🧩 Routes
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profileRoutes.js";
import userRecordsRoutes from "./routes/userRecordsRoutes.js";
import doctorProfileRoutes from "./routes/doctorProfileRoutes.js";
import appointmentsRoutes from "./routes/appointmentsRoutes.js";
import userJSONRoutes from "./routes/userJSONroutes.js"; // 👈 NEW IMPORT
import reminderRoutes from "./routes/reminderRoutes.js"; // ✅ Twilio reminders route
import medicineRoutes from "./routes/medicineRoutes.js";


dotenv.config();
const app = express();

// 🧱 Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// 🚀 Routes
app.use("/api", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/records", userRecordsRoutes);
app.use("/api/doctor", doctorProfileRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/json", userJSONRoutes);
app.use("/api/reminders", reminderRoutes); // ✅ Twilio + cron reminder routes
app.use("/api/medicines", medicineRoutes);


// 🌍 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
