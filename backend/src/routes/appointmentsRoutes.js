import express from "express";
import {
  getAllDoctors,
  getDoctorAppointments,
  getUserAppointments,
  bookAppointment,
  updateAppointment
} from "../controllers/appointmentsController.js";

const router = express.Router();

// ---------- Doctors ----------
router.get("/doctors", getAllDoctors);

// ---------- Users ----------
router.get("/user/:userId", getUserAppointments);
router.post("/book", bookAppointment);

// ---------- Doctor ----------
router.get("/doctor/:doctorId", getDoctorAppointments);
router.patch("/:appointmentId", updateAppointment);

export default router;
