import { db } from "../src/db.js";
import crypto from "crypto";
import medicines from "../data/medicineData.js";

async function insertMedicines() {
  try {
    for (const med of medicines) {
      const medicine_id = crypto.randomUUID();

      const [exists] = await db.execute(
        "SELECT name FROM medicines WHERE name = ?",
        [med.name]
      );

      if (exists.length) {
        console.log(`⚠️ Skipped (already exists): ${med.name}`);
        continue;
      }

      const sql = `
        INSERT INTO medicines (medicine_id, name, category, usage_info, dosage, type)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      await db.execute(sql, [
        medicine_id,
        med.name || null,
        med.category || null,
        med.usage_info || null,
        med.dosage || null,
        med.type || null,
      ]);

      console.log(`✅ Inserted: ${med.name}`);
    }

    console.log("✨ All medicines inserted successfully!");
  } catch (err) {
    console.error("❌ Error inserting medicines:", err.message);
  } finally {
    await db.end();
  }
}

insertMedicines();
