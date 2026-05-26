import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// 🧩 Routes
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profileRoutes.js";
import userRecordsRoutes from "./routes/userRecordsRoutes.js";
import doctorProfileRoutes from "./routes/doctorProfileRoutes.js";
import appointmentsRoutes from "./routes/appointmentsRoutes.js";
import userJSONRoutes from "./routes/userJSONroutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";
import medicineRoutes from "./routes/medicineRoutes.js";

dotenv.config();
const app = express();

// 📍 Needed for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🧱 Middleware
app.use(cors({
  origin: [
    "https://heal-sync-ai-full.vercel.app",
    "https://heal-sync-ai-full-sot7.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// 🚀 API Routes
app.use("/api", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/records", userRecordsRoutes);
app.use("/api/doctor", doctorProfileRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/json", userJSONRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/medicines", medicineRoutes);

// ✅ Serve frontend (React + Vite build)
const frontendPath = path.join(__dirname, "../../HealSync/dist"); // or "../client/dist" if kept outside backend folder
app.use(express.static(frontendPath));

// ✅ Catch-all route to handle SPA refresh
// ✅ Handles all non-API routes in Express v5
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});


// 🌍 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
