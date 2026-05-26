import { db } from "../src/db.js";
import doctors from "../data/doctorsData.js";
import crypto from "crypto";

async function insertDoctors() {
  try {
    console.log("✅ MySQL connected");

    for (const doc of doctors) {
      // sanity check
      if (!doc || !doc.name || !doc.speciality) {
        console.log("⚠️ Skipped invalid entry:", doc);
        continue;
      }

      const custom_id = crypto.randomUUID();
      const baseEmail = `${doc.name.toLowerCase().replace(/\s+/g, "")}@healsync.com`;
      const aadhaar_number = Math.floor(100000000000 + Math.random() * 900000000000).toString();

      // check for duplicate email
      let email = baseEmail;
      let counter = 1;
      while (true) {
        const [exists] = await db.execute("SELECT email FROM users WHERE email = ?", [email]);
        if (exists.length === 0) break;
        email = `${doc.name.toLowerCase().replace(/\s+/g, "")}${counter}@healsync.com`;
        counter++;
      }

      // insert into users
      await db.execute(
        `INSERT INTO users (custom_id, role, name, email, password)
         VALUES (?, 'doctor', ?, ?, 'default123')`,
        [custom_id, doc.name, email]
      );

      // insert into doctor_profiles
      await db.execute(
        `INSERT INTO doctor_profiles
         (custom_id, full_name, specialization, clinic_address, aadhaar_number, availability)
         VALUES (?, ?, ?, ?, ?, 'Available')`,
        [custom_id, doc.name, doc.speciality, doc.address || "N/A", aadhaar_number]
      );

      console.log(`✅ Inserted: ${doc.name}`);
    }

    console.log("✨ All doctors inserted successfully!");
  } catch (err) {
    console.error("❌ Error inserting doctors:", err.message);
  } finally {
    await db.end();
  }
}

insertDoctors();
