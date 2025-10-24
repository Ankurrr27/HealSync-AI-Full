// controllers/userRecordsController.js
import { db } from "../db.js";
import path from "path";

// Upload
export const uploadRecord = async (req, res) => {
  try {
    const { custom_id } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = `uploads/${file.filename}`;
    const fileType = path.extname(file.originalname).slice(1);

    const [result] = await db.query(
      "INSERT INTO user_records (custom_id, file_name, file_path, file_type) VALUES (?, ?, ?, ?)",
      [custom_id, file.originalname, filePath, fileType]
    );

    res.json({
      message: "✅ File uploaded!",
      record: {
        record_id: result.insertId,
        custom_id,
        file_name: file.originalname,
        file_path: filePath,
        file_type: fileType,
        uploaded_at: new Date(),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Fetch
export const getRecords = async (req, res) => {
  try {
    const { custom_id } = req.params;
    const [results] = await db.query(
      `SELECT record_id, custom_id, file_name, file_path, file_type, uploaded_at
       FROM user_records
       WHERE custom_id = ?
       ORDER BY uploaded_at DESC`,
      [custom_id]
    );

    const fixedResults = results.map(r => ({
      ...r,
      file_path: r.file_path.replace(/\\/g, "/"),
    }));

    res.json(fixedResults);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
