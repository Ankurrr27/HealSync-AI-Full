import express from "express";
import { db } from "../db.js";
// if the file is outside src/
import medicines from "../../data/medicineData.js";


const router = express.Router();

// 🧾 GET all medicines
router.get("/", async (req, res) => {
  try {
    // If you already inserted them in MySQL 👇
    const [rows] = await db.execute("SELECT * FROM medicines");
    return res.json(rows);
    
    // Or, if you just want to serve directly from file 👇
    // return res.json(medicines);
  } catch (err) {
    console.error("Error fetching medicines:", err.message);
    res.status(500).json({ error: "Failed to fetch medicines" });
  }
});

export default router;
