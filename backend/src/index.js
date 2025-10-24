import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profileRoutes.js";
import path from "path";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json()); // must be BEFORE routes

app.use("/api", authRoutes);
app.use("/api/profile", profileRoutes);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


app.listen(5000, () => console.log("Server running on http://localhost:5000"));
