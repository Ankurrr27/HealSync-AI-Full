import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profileRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json()); // must be BEFORE routes

app.use("/api", authRoutes);
app.use("/api/profile", profileRoutes);


app.listen(5000, () => console.log("Server running on http://localhost:5000"));
