import { db } from "../db.js";
import path from "path";
import fs from "fs";
import * as pdfParse from "pdf-parse";
 // For extracting text from PDFs


// ✅ Upload Record
export const uploadRecord = async (req, res) => {
  try {
    const custom_id = req.params.custom_id || req.body.custom_id;
    const file = req.file;

    if (!custom_id)
      return res.status(400).json({ error: "custom_id is required" });
    if (!file)
      return res.status(400).json({ error: "No file uploaded" });

    // 🧠 Ensure user_profile exists
    const [userExists] = await db.query(
      "SELECT id FROM user_profiles WHERE custom_id = ?",
      [custom_id]
    );

    if (!userExists.length) {
      const aadhaar_number = String(
        Math.floor(100000000000 + Math.random() * 900000000000)
      ); // 12-digit random unique Aadhaar
      await db.query(
        "INSERT INTO user_profiles (custom_id, aadhaar_number) VALUES (?, ?)",
        [custom_id, aadhaar_number]
      );
      console.log(`🆕 Created profile for ${custom_id} with Aadhaar ${aadhaar_number}`);
    }

    // 📂 Save uploaded file
    const filePath = `uploads/${file.filename}`;
    const fileType = path.extname(file.originalname).slice(1);

    const [result] = await db.query(
      "INSERT INTO user_records (custom_id, file_name, file_path, file_type) VALUES (?, ?, ?, ?)",
      [custom_id, file.originalname, filePath, fileType]
    );

    const newRecord = {
      record_id: result.insertId,
      custom_id,
      file_name: file.originalname,
      file_path: filePath.replace(/\\/g, "/"),
      file_type: fileType,
      uploaded_at: new Date(),
    };

    res.json({
      message: "✅ File uploaded successfully!",
      record: newRecord,
    });

    // ⚙️ Trigger extraction if PDF
    if (fileType === "pdf") {
      console.log(`🔍 Starting text extraction for ${file.originalname}...`);
      extractPDFTextAndSave(custom_id, result.insertId, filePath);
    }

  } catch (err) {
    console.error("❌ Upload Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Fetch All Records
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

    const fixedResults = results.map((r) => ({
      ...r,
      file_path: r.file_path.replace(/\\/g, "/"),
    }));

    res.json(fixedResults);
  } catch (err) {
    console.error("❌ Get Records Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🧠 Helper: Extract text from PDF and save in user_json
const extractPDFTextAndSave = async (custom_id, record_id, file_path) => {
  try {
    const dataBuffer = fs.readFileSync(file_path);
    const pdfData = await pdf(dataBuffer);

    const jsonData = {
      custom_id,
      record_id,
      text: pdfData.text,
    };

    // Save extracted text in user_json table
    await db.query(
      `INSERT INTO user_json (custom_id, record_id, json_data)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE
       json_data = VALUES(json_data),
       record_id = VALUES(record_id)`,
      [custom_id, record_id, JSON.stringify(jsonData)]
    );

    console.log(`✅ Text extracted & saved for ${custom_id} (record_id: ${record_id})`);
  } catch (err) {
    console.error(`⚠️ PDF extraction failed for record ${record_id}:`, err.message);
  }
};
