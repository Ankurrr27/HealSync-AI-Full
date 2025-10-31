import axios from "axios";
import { db } from "../src/db.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const API_URLS = [
  "https://6904a4086b8dabde4964842b.mockapi.io/doctors/Mumbai",
  "https://6904a4086b8dabde4964842b.mockapi.io/doctors/agra",
  "https://690485ce6b8dabde496414b4.mockapi.io/doctors/Chandigarh",
  "https://690485ce6b8dabde496414b4.mockapi.io/doctors/Jaipur",
];

function generateAadhaar() {
  return Math.floor(100000000000 + Math.random() * 900000000000).toString();
}

async function fetchAndInsertDoctors() {
  try {
    console.log("✅ MySQL connected");
    console.log("🌐 Fetching doctors from mock APIs...");

    let allDoctors = [];
    for (const url of API_URLS) {
      const { data } = await axios.get(url);
      allDoctors.push(...data);
    }

    console.log(`✅ Fetched ${allDoctors.length} doctors`);

    for (const doc of allDoctors) {
      const custom_id = crypto.randomUUID();
      const name = doc.name?.trim() || "Unknown Doctor";
      const email = doc.email || `${name.replace(/\s+/g, "").toLowerCase()}@healsync.com`;
      const specialization = doc.specialization || "General Physician";
      const experience = parseInt(doc.experience) || 5;
      const location = doc.location || "Unknown";
      const phone = doc.phone || "9999999999";
      const aadhaar = generateAadhaar();

      // Avoid duplicates
      const [exists] = await db.execute("SELECT email FROM users WHERE email = ?", [email]);
      if (exists.length) {
        console.log(`⚠️ Skipped (already exists): ${name}`);
        continue;
      }

      // Hash default password
      const hashedPassword = await bcrypt.hash("doctor123", 10);

      // Insert into users
      await db.execute(
        `INSERT INTO users (custom_id, name, email, password, role)
         VALUES (?, ?, ?, ?, ?)`,
        [custom_id, name, email, hashedPassword, "doctor"]
      );

      // Insert into doctor_profiles
      await db.execute(
  `INSERT INTO doctor_profiles 
   (custom_id, full_name, specialization, experience_years, location, contact_number, email, aadhaar_number)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  [custom_id, name, specialization, experience, location, phone, email, aadhaar]
);

      console.log(`✅ Inserted: ${name}`);
    }

    console.log("✨ All doctors inserted successfully!");
  } catch (err) {
    console.error("❌ Error inserting doctors:", err.message);
  } finally {
    await db.end();
  }
}

fetchAndInsertDoctors();
