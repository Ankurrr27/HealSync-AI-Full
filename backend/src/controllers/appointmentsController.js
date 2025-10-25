import { db } from "../db.js";

// ------------------ Doctors ------------------
// GET all available doctors for patient dropdown
export const getAllDoctors = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT custom_id, full_name, specialization FROM doctor_profiles WHERE availability = 'Available'"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching doctors" });
  }
};

// ------------------ Appointments ------------------

// GET all appointments for a doctor
export const getDoctorAppointments = async (req, res) => {
  const { doctorId } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT a.*, u.full_name AS patient_name
       FROM appointments a
       JOIN user_profiles u ON a.user_id = u.custom_id
       WHERE a.doctor_id = ? ORDER BY appointment_date DESC`,
      [doctorId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET all appointments for a user
export const getUserAppointments = async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT a.*, d.full_name AS doctor_name
       FROM appointments a
       JOIN doctor_profiles d ON a.doctor_id = d.custom_id
       WHERE a.user_id = ? ORDER BY appointment_date DESC`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST: user requests an appointment
// POST: user requests an appointment
export const bookAppointment = async (req, res) => {
  const { user_id, doctor_id, reason, appointment_date } = req.body;

  if (!user_id || !doctor_id || !reason || !appointment_date)
    return res.status(400).json({ message: "All fields are required, including appointment date" });

  try {
    const [result] = await db.query(
      "INSERT INTO appointments (user_id, doctor_id, reason, status, appointment_date) VALUES (?, ?, ?, 'pending', ?)",
      [user_id, doctor_id, reason, appointment_date]
    );
    res.json({ message: "Appointment request sent", appointmentId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// PATCH: doctor updates appointment status & date
export const updateAppointment = async (req, res) => {
  const { appointmentId } = req.params;
  const { status, appointment_date } = req.body;

  const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
  if (!validStatuses.includes(status))
    return res.status(400).json({ message: "Invalid status value" });

  try {
    await db.query(
      "UPDATE appointments SET status = ?, appointment_date = ? WHERE id = ?",
      [status, appointment_date || null, appointmentId]
    );
    res.json({ message: "Appointment updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
