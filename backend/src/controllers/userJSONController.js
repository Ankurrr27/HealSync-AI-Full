import { db } from "../db.js";

// Save or update JSON (one record per custom_id)
export const saveExtractedJSON = async (req, res) => {
  try {
    const { custom_id, extractedData } = req.body;

    if (!custom_id || !extractedData)
      return res.status(400).json({ error: "Missing custom_id or data" });

    const jsonData =
      typeof extractedData === "string"
        ? extractedData
        : JSON.stringify(extractedData);

    // Upsert: insert or update if exists
    const [result] = await db.query(
      `INSERT INTO user_json (custom_id, json_data)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE json_data = VALUES(json_data), updated_at = CURRENT_TIMESTAMP`,
      [custom_id, jsonData]
    );

    res.json({
      message: "✅ JSON saved or updated successfully!",
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    console.error("❌ JSON Save Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Fetch JSON data for a user
export const getUserJSON = async (req, res) => {
  try {
    const { custom_id } = req.params;
    const [records] = await db.query(
      "SELECT * FROM user_json WHERE custom_id = ?",
      [custom_id]
    );

    if (!records.length)
      return res.status(404).json({ message: "No JSON found for this user" });

    res.json({
      custom_id,
      data: JSON.parse(records[0].json_data),
      updated_at: records[0].updated_at,
    });
  } catch (err) {
    console.error("❌ Error fetching user JSON:", err);
    res.status(500).json({ error: err.message });
  }
};
