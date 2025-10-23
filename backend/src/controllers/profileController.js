import { db } from '../db.js';
import fs from 'fs';

// GET profile (auto-create if missing)
export const getProfile = async (req, res) => {
  try {
    const { custom_id } = req.params;

    // Check if user exists
    const [userCheck] = await db.execute(
      'SELECT custom_id FROM users WHERE custom_id = ?',
      [custom_id]
    );
    if (!userCheck.length)
      return res.status(404).json({ message: 'User not found' });

    // Check if profile exists
    const [rows] = await db.execute(
      'SELECT * FROM user_profiles WHERE custom_id = ?',
      [custom_id]
    );

    if (!rows.length) {
      await db.execute('INSERT INTO user_profiles (custom_id) VALUES (?)', [
        custom_id,
      ]);
      return res.json({
        custom_id,
        full_name: '',
        date_of_birth: '',
        gender: 'Male',
        blood_group: '',
        primary_doctor: '',
        mobile_number: '',
        email: '',
        current_address: '',
        profile_image: null,
        profile_url: null,
      });
    }

    const profile = rows[0];
    profile.profile_url = profile.profile_image
      ? `http://localhost:5000/${profile.profile_image}`
      : null;

    res.json(profile);
  } catch (err) {
    console.error('GET profile error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// UPSERT profile
export const upsertProfile = async (req, res) => {
  try {
    const custom_id = req.params.custom_id;
    if (!custom_id)
      return res.status(400).json({ message: 'custom_id is required' });

    const {
      full_name = null,
      date_of_birth = null,
      gender = 'Male',
      blood_group = null,
      primary_doctor = null,
      mobile_number = null,
      email = null,
      current_address = null,
    } = req.body;

    // Validate user exists
    const [userExists] = await db.execute(
      'SELECT custom_id FROM users WHERE custom_id = ?',
      [custom_id]
    );
    if (!userExists.length)
      return res.status(400).json({ message: 'User does not exist' });

    // Handle image
    const profile_image = req.file ? req.file.path.replace(/\\/g, '/') : null;

    // Delete old image if uploading a new one
    const [existing] = await db.execute(
      'SELECT profile_image FROM user_profiles WHERE custom_id = ?',
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

    // Convert date_of_birth to MySQL DATE format (YYYY-MM-DD)
    let dob = date_of_birth ? date_of_birth.split('T')[0] : undesfined;

    // UPSERT
    await db.execute(
      `INSERT INTO user_profiles 
        (custom_id, full_name, date_of_birth, gender, blood_group, primary_doctor, mobile_number, email, current_address, profile_image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         full_name=VALUES(full_name),
         date_of_birth=VALUES(date_of_birth),
         gender=VALUES(gender),
         blood_group=VALUES(blood_group),
         primary_doctor=VALUES(primary_doctor),
         mobile_number=VALUES(mobile_number),
         email=VALUES(email),
         current_address=VALUES(current_address),
         profile_image=COALESCE(VALUES(profile_image), profile_image)`,
      [
        custom_id,
        full_name,
        dob || null,
        gender,
        blood_group,
        primary_doctor,
        mobile_number,
        email,
        current_address,
        profile_image,
      ]
    );

    const profile_url = profile_image
      ? `http://localhost:5000/${profile_image}`
      : null;
    res.json({
      message: 'Profile saved successfully!',
      profile_image: profile_url,
    });
  } catch (err) {
    console.error('POST profile upsert error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
