import { db } from "../db.js";
import fs from "fs";

// GET profile (auto-create if missing)
export const getProfile = async (req, res) => {
  try {
    const { custom_id } = req.params;

    // Check if user exists
    const [userCheck] = await db.execute(
      "SELECT custom_id FROM users WHERE custom_id = ?",
      [custom_id]
    );
    if (!userCheck.length)
      return res.status(404).json({ message: "User not found" });

    // Check if profile exists
    const [rows] = await db.execute(
      "SELECT * FROM user_profiles WHERE custom_id = ?",
      [custom_id]
    );

    if (!rows.length) {
      await db.execute("INSERT INTO user_profiles (custom_id) VALUES (?)", [
        custom_id,
      ]);
      return res.json({
        custom_id,
        full_name: "",
        date_of_birth: "",
        gender: "Male",
        blood_group: "",
        primary_doctor: "",
        mobile_number: "",
        email: "",
        current_address: "",
        profile_image: null,
        profile_url: null,
        aadhaar_number: "", // 🆕 added field
      });
    }

    const profile = rows[0];
const baseURL = process.env.BASE_URL || "https://healsync-ai-full.onrender.com";

    profile.profile_url = profile.profile_image
      ? `${baseURL}/${profile.profile_image.replace(/\\/g, "/")}`
      : null;

    res.json(profile);
  } catch (err) {
    console.error("GET profile error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// UPSERT profile
export const upsertProfile = async (req, res) => {
  try {
    const { custom_id } = req.params;
    if (!custom_id)
      return res.status(400).json({ message: "custom_id is required" });

    const {
      full_name = null,
      date_of_birth = null,
      gender = "Male",
      blood_group = null,
      primary_doctor = null,
      mobile_number = null,
      email = null,
      current_address = null,
      aadhaar_number = null, // 🆕 added field
    } = req.body;

    // Validate user exists
    const [userExists] = await db.execute(
      "SELECT custom_id FROM users WHERE custom_id = ?",
      [custom_id]
    );
    if (!userExists.length)
      return res.status(400).json({ message: "User does not exist" });

    // ✅ Validate Aadhaar (must be unique and 12 digits)
    if (!aadhaar_number || !/^\d{12}$/.test(aadhaar_number)) {
      return res
        .status(400)
        .json({ message: "Valid 12-digit Aadhaar number required" });
    }

    // Check if Aadhaar already exists for another user
    const [aadhaarCheck] = await db.execute(
      "SELECT custom_id FROM user_profiles WHERE aadhaar_number = ? AND custom_id != ?",
      [aadhaar_number, custom_id]
    );
    if (aadhaarCheck.length) {
      return res
        .status(400)
        .json({ message: "Aadhaar number already linked to another user" });
    }

    // Handle image
    const profile_image = req.file ? req.file.path.replace(/\\/g, "/") : null;

    // Delete old image if uploading a new one
    const [existing] = await db.execute(
      "SELECT profile_image FROM user_profiles WHERE custom_id = ?",
      [custom_id]
    );
    if (
      profile_image &&
      existing.length &&
      existing[0].profile_image &&
      fs.existsSync(existing[0].profile_image)
    ) {
      fs.unlinkSync(existing[0].profile_image);
    }

    // Convert date_of_birth to MySQL DATE format
    const dob = date_of_birth ? date_of_birth.split("T")[0] : null;

    // UPSERT query
    await db.execute(
      `INSERT INTO user_profiles 
        (custom_id, full_name, date_of_birth, gender, blood_group, primary_doctor, mobile_number, email, current_address, profile_image, aadhaar_number)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         full_name=VALUES(full_name),
         date_of_birth=VALUES(date_of_birth),
         gender=VALUES(gender),
         blood_group=VALUES(blood_group),
         primary_doctor=VALUES(primary_doctor),
         mobile_number=VALUES(mobile_number),
         email=VALUES(email),
         current_address=VALUES(current_address),
         profile_image=COALESCE(VALUES(profile_image), profile_image),
         aadhaar_number=VALUES(aadhaar_number)`, // 🆕 added update
      [
        custom_id,
        full_name,
        dob,
        gender,
        blood_group,
        primary_doctor,
        mobile_number,
        email,
        current_address,
        profile_image,
        aadhaar_number,
      ]
    );

    const baseURL = "http://localhost:5000";
    const profile_url = profile_image
      ? `${baseURL}/${profile_image.replace(/\\/g, "/")}`
      : null;

    res.json({
      message: "Profile saved successfully!",
      profile_image: profile_url,
    });
  } catch (err) {
    console.error("POST profile upsert error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
