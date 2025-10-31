import React, { useState, useEffect } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000/api";
const STATIC_BASE_URL = "http://localhost:5000";

const PatientAppointment = () => {
  const { custom_id } = useOutletContext();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [reason, setReason] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch appointments from your backend
  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/appointments/user/${custom_id}`);
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  // 🔹 Fetch doctors from both backend and mock APIs
  const fetchDoctors = async () => {
    try {
      const [backend, jaipur, chandigarh] = await Promise.all([
        axios.get(`${API_BASE_URL}/appointments/doctors`),
        axios.get("https://690485ce6b8dabde496414b4.mockapi.io/doctors/Jaipur"),
        axios.get("https://690485ce6b8dabde496414b4.mockapi.io/doctors/Chandigarh"),
      ]);

      const merged = [
        ...backend.data.map((doc) => ({
          id: doc.custom_id,
          name: doc.full_name,
          specialization: doc.specialization,
          qualification: doc.qualification,
          experience_years: doc.experience_years,
          avatar: doc.profile_image
            ? `${STATIC_BASE_URL}/${doc.profile_image.replace(/^\/?/, "")}`
            : "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
          source: "backend",
        })),
        ...jaipur.data.map((d) => ({
          id: d.id,
          name: d.name || d.full_name || "Doctor",
          specialization: d.specialization || "General Physician",
          qualification: d.qualification || "MBBS",
          experience_years: d.experience || "2",
          avatar:
            d.avatar ||
            d.photo ||
            d.image ||
            "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
          source: "mock",
        })),
        ...chandigarh.data.map((d) => ({
          id: d.id,
          name: d.name || d.full_name || "Doctor",
          specialization: d.specialization || "General Physician",
          qualification: d.qualification || "MBBS",
          experience_years: d.experience || "2",
          avatar:
            d.avatar ||
            d.photo ||
            d.image ||
            "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
          source: "mock",
        })),
      ];

      setDoctors(merged);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  // 🔹 Fetch specific doctor profile from backend when selected
const fetchDoctorProfile = async (doctorId) => {
  const selected = doctors.find((d) => d.id === doctorId);

  if (selected?.source === "mock") {
    setDoctorProfile(selected);
  } else {
    try {
      const res = await axios.get(`${API_BASE_URL}/doctor/${doctorId}`);
      const data = res.data;

      const imagePath = data.profile_image
        ? data.profile_image.replace(/^\/?/, "")
        : null;

      const docProfile = {
        id: data.custom_id,
        name: data.full_name,
        specialization: data.specialization,
        qualification: data.qualification,
        experience_years: data.experience_years,
        avatar: imagePath
          ? `http://localhost:5000/${imagePath}`
          : "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
      };

      setDoctorProfile(docProfile);
    } catch (err) {
      console.error("Error fetching doctor profile:", err);
      setDoctorProfile(selected || null);
    }
  }
};


  useEffect(() => {
    Promise.all([fetchAppointments(), fetchDoctors()]).finally(() => setLoading(false));
  }, []);

  const handleBook = async () => {
    if (!selectedDoctor || !reason || !appointmentDate) {
      return alert("Select doctor, reason, and appointment date");
    }

    const selectedDoc = doctors.find((d) => d.id === selectedDoctor);
    if (!selectedDoc) return alert("Doctor not found!");

    try {
      await axios.post(`${API_BASE_URL}/appointments/book`, {
        user_id: custom_id,
        doctor_id: selectedDoctor,
        doctor_name: selectedDoc.name,
        reason,
        appointment_date: appointmentDate,
      });

      setSelectedDoctor("");
      setDoctorProfile(null);
      setReason("");
      setAppointmentDate("");
      fetchAppointments();
      alert("Appointment booked successfully!");
    } catch (err) {
      console.error("Booking error:", err);
      alert("Failed to book appointment.");
    }
  };

  if (loading) return null;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Book an Appointment</h2>

      {/* 🔹 Doctor Preview */}
      {doctorProfile && (
        <div className="flex gap-4 items-center p-4 bg-white rounded-xl shadow hover:shadow-lg transition animate-fadeIn">
          <img
            src={
              doctorProfile.avatar?.startsWith("http")
                ? doctorProfile.avatar
                : `${STATIC_BASE_URL}/${doctorProfile.avatar}`
            }
            alt={doctorProfile.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-indigo-100"
          />
          <div>
            <h3 className="text-lg font-bold text-gray-800">{doctorProfile.name}</h3>
            <p className="text-gray-600">{doctorProfile.specialization}</p>
            <p className="text-gray-500">{doctorProfile.qualification}</p>
            <p className="text-gray-500">
              Experience: {doctorProfile.experience_years || "—"} yrs
            </p>
          </div>
        </div>
      )}

      {/* 🔹 Booking Form */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-xl shadow hover:shadow-lg transition animate-fadeIn">
        <select
          value={selectedDoctor}
          onChange={(e) => {
            setSelectedDoctor(e.target.value);
            fetchDoctorProfile(e.target.value);
          }}
          className="border rounded px-3 py-2 w-full md:w-1/3"
        >
          <option value="">Select Doctor</option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name} ({doc.specialization})
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-1/3"
        />

        <input
          type="text"
          placeholder="Reason for visit"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="border rounded px-3 py-2 w-full md:flex-1"
        />

        <button
          onClick={handleBook}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Book
        </button>
      </div>

      {/* 🔹 Appointment List */}
      <h3 className="text-xl font-bold text-gray-800">Your Appointments</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {appointments.length === 0 ? (
          <p className="text-gray-500 col-span-full">No appointments yet</p>
        ) : (
          appointments.map((appt) => {
            let bgColor = "",
              textColor = "",
              borderColor = "";
            switch (appt.status?.toLowerCase()) {
              case "confirmed":
                bgColor = "bg-green-50";
                textColor = "text-green-700";
                borderColor = "border-green-400";
                break;
              case "pending":
                bgColor = "bg-yellow-50";
                textColor = "text-yellow-700";
                borderColor = "border-yellow-400";
                break;
              case "rejected":
                bgColor = "bg-red-50";
                textColor = "text-red-700";
                borderColor = "border-red-400";
                break;
              default:
                bgColor = "bg-gray-50";
                textColor = "text-gray-700";
                borderColor = "border-gray-300";
            }

            return (
              <div
                key={appt.id}
                className={`flex gap-4 items-center p-4 rounded-xl shadow border-l-4 transition hover:shadow-md ${bgColor} ${borderColor}`}
              >
                <div className="flex-1">
                  <p>
                    Doctor: <strong>{appt.doctor_name}</strong>
                  </p>
                  <p className={textColor}>
                    Status: <strong className="capitalize">{appt.status}</strong>
                  </p>
                  <p>Reason: {appt.reason}</p>
                  {appt.appointment_date && (
                    <p>Date: {new Date(appt.appointment_date).toLocaleString()}</p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PatientAppointment;
