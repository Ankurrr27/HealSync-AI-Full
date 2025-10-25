import { db } from "../db.js";

// Create or Update Doctor Profile
export const upsertDoctorProfile = async (req, res) => {
  let { custom_id } = req.body;
  if (Array.isArray(custom_id)) custom_id = custom_id[0];

  const {
    full_name,
    specialization,
    qualification,
    experience_years,
    gender,
    contact_number,
    email,
    clinic_address,
    availability,
  } = req.body;

  // Use uploaded file path if present
  let profile_image = req.file ? `uploads/doctor_profiles/${req.file.filename}` : null;

  if (!custom_id)
    return res.status(400).json({ message: "Custom ID is required!" });

  try {
    const [userExists] = await db.query(
      "SELECT 1 FROM users WHERE custom_id = ?",
      [custom_id]
    );
    if (!userExists.length)
      return res.status(400).json({ message: "User not registered!" });

    const [existingProfile] = await db.query(
      "SELECT 1 FROM doctor_profiles WHERE custom_id = ?",
      [custom_id]
    );

    if (existingProfile.length) {
      await db.query(
        `UPDATE doctor_profiles 
         SET full_name=?, specialization=?, qualification=?, experience_years=?, gender=?, 
             contact_number=?, email=?, clinic_address=?, profile_image=?, availability=?, updated_at=CURRENT_TIMESTAMP
         WHERE custom_id=?`,
        [
          full_name,
          specialization,
          qualification,
          experience_years,
          gender,
          contact_number,
          email,
          clinic_address,
          profile_image || existingProfile[0].profile_image, // keep old image if none uploaded
          availability,
          custom_id,
        ]
      );

      const [updatedProfile] = await db.query(
        "SELECT * FROM doctor_profiles WHERE custom_id = ?",
        [custom_id]
      );

      return res
        .status(200)
        .json({ message: "Doctor profile updated successfully!", profile: updatedProfile[0] });
    }

    await db.query(
      `INSERT INTO doctor_profiles 
       (custom_id, full_name, specialization, qualification, experience_years, gender, 
        contact_number, email, clinic_address, profile_image, availability)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        custom_id,
        full_name,
        specialization,
        qualification,
        experience_years,
        gender,
        contact_number,
        email,
        clinic_address,
        profile_image,
        availability,
      ]
    );

    const [newProfile] = await db.query(
      "SELECT * FROM doctor_profiles WHERE custom_id = ?",
      [custom_id]
    );

    res.status(201).json({ message: "Doctor profile created successfully!", profile: newProfile[0] });
  } catch (error) {
    console.error("Error creating/updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// Get Doctor Profile
export const getDoctorProfile = async (req, res) => {
  const { custom_id } = req.params;
  if (!custom_id)
    return res.status(400).json({ message: "Custom ID is required!" });

  try {
    const [rows] = await db.query(
      "SELECT * FROM doctor_profiles WHERE custom_id = ?",
      [custom_id]
    );
    if (!rows.length)
      return res.status(404).json({ message: "Doctor profile not found!" });

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching doctor profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
