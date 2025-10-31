// extractTextJob.js
import { db } from "./db.js";
import fs from "fs";
import pkg from "pdf-parse";
const pdf = pkg;

const extractAndSavePDFText = async () => {
  try {
    const [pdfRecords] = await db.query(
      "SELECT record_id, custom_id, file_path FROM user_records WHERE file_type = 'pdf'"
    );

    console.log(`Found ${pdfRecords.length} PDFs to process...`);

    for (const record of pdfRecords) {
      try {
        const { record_id, custom_id, file_path } = record;

        console.log(`🔍 Starting text extraction for ${file_path}...`);
        const dataBuffer = fs.readFileSync(file_path);
        const pdfData = await pdf(dataBuffer);

        const jsonData = {
          custom_id,
          record_id,
          text: pdfData.text,
        };

        await db.query(
          `INSERT INTO user_json (custom_id, record_id, json_data)
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE
           json_data = VALUES(json_data),
           record_id = VALUES(record_id)`,
          [custom_id, record_id, JSON.stringify(jsonData)]
        );

        console.log(`✅ Extracted & saved text for ${custom_id} (record_id: ${record_id})`);
      } catch (pdfErr) {
        console.error(`⚠️ Failed to process record_id ${record.record_id}:`, pdfErr.message);
      }
    }

    console.log("✨ PDF text extraction completed!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error in extract job:", err);
    process.exit(1);
  }
};

extractAndSavePDFText();
