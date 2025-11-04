import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiStar } from "react-icons/fi";
import { useOutletContext } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const STATIC_BASE_URL = "https://healsync-ai-full.onrender.com";


const PatientAppointment = () => {
  const { custom_id } = useOutletContext();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedCity, setSelectedCity] = useState("All");

  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [reason, setReason] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterSpec, setFilterSpec] = useState("");
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [tempFeedback, setTempFeedback] = useState("");
  const [tempRating, setTempRating] = useState(0);
  const [canGiveFeedback, setCanGiveFeedback] = useState(false);

  // 🩵 Fetch appointments
  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/appointments/user/${custom_id}`);
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  // 🩵 Fetch doctors
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
    location: doc.location || doc.city || "Not specified",
    source: "backend",
  })),
  ...jaipur.data.map((doc) => ({ ...doc, source: "Jaipur", location: "Jaipur" })),
  ...chandigarh.data.map((doc) => ({ ...doc, source: "Chandigarh", location: "Chandigarh" })),
].map((d) => ({
  id: d.id || d.custom_id,
  name: d.name || d.full_name || "Doctor",
  specialization: d.specialization || "General Physician",
  qualification: d.qualification || "MBBS",
  experience_years: d.experience_years || d.experience || "2",
  location: d.location || "Unknown",
  avatar:
    d.avatar ||
    d.photo ||
    d.image ||
    "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
  source: d.source || "mock",
}));


      setDoctors(merged);
      setFilteredDoctors(merged);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  // 🩵 Fetch doctor profile
  const fetchDoctorProfile = async (doctorId) => {
    const selected = doctors.find((d) => d.id === doctorId);
    if (selected?.source === "mock") {
      setDoctorProfile(selected);
    } else {
      try {
        const res = await axios.get(`${API_BASE_URL}/doctor/${doctorId}`);
        const data = res.data;
        setDoctorProfile({
          id: data.custom_id,
          name: data.full_name,
          specialization: data.specialization,
          qualification: data.qualification,
          experience_years: data.experience_years,
          avatar: data.profile_image
            ? `http://localhost:5000/${data.profile_image.replace(/^\/?/, "")}`
            : "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
        });
      } catch {
        setDoctorProfile(selected || null);
      }
    }

    // check if user has appointment with this doctor
    const hasAppointment = appointments.some(
      (a) => a.doctor_id === doctorId || a.doctor_name === selected?.name
    );
    setCanGiveFeedback(hasAppointment);
  };

  useEffect(() => {
    Promise.all([fetchAppointments(), fetchDoctors()]).finally(() => setLoading(false));
  }, []);

  // 🔹 Filter doctors
useEffect(() => {
  const filtered = doctors.filter((doc) => {
    const matchSpec = filterSpec
      ? doc.specialization.toLowerCase().includes(filterSpec.toLowerCase())
      : true;

    const matchCity =
      selectedCity === "All"
        ? true
        : doc.source?.toLowerCase().includes(selectedCity.toLowerCase());

    return matchSpec && matchCity; // both conditions must pass 💥
  });

  setFilteredDoctors(filtered);
}, [filterSpec, selectedCity, doctors]);


  const handleBook = async () => {
  if (!selectedDoctor || !reason || !appointmentDate)
    return alert("Please fill all details before booking!");

  const selectedDoc = doctors.find((d) => d.id === selectedDoctor);
  if (!selectedDoc) return alert("Doctor not found!");

  try {
    await axios.post(`${API_BASE_URL}/appointments/book`, {
      user_id: custom_id,
      doctor_id: selectedDoctor,
      doctor_name: selectedDoc.name,
      doctor_address:
        selectedDoc.address || selectedDoc.location || "Address not available",
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


  if (loading)
    return <div className="text-center py-10 text-gray-500 animate-pulse">Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-black text-center">🩺 Book an Appointment</h2>

      {/* 🔹 Filter Section */}
    

      <div className="flex flex-wrap gap-3 items-center justify-between bg-white p-2 md:p-4 rounded-xl shadow">
  <input
    type="text"
    placeholder="Filter by specialization (e.g. Cardiologist)"
    value={filterSpec}
    onChange={(e) => setFilterSpec(e.target.value)}
    className="border border-gray-300 text-xs md:text-sm px-4 py-2 rounded-md flex-1 focus:ring-2 focus:ring-indigo-400"
  />

  <select
    value={selectedCity}
    onChange={(e) => setSelectedCity(e.target.value)}
    className="border border-gray-300 text-xs md:text-sm px-4 py-2 rounded-md focus:ring-2 focus:ring-indigo-400"
  >
    <option value="All">All Cities</option>
    <option value="Jaipur">Jaipur</option>
    <option value="Chandigarh">Chandigarh</option>
    <option value="backend">Backend (Other)</option>
  </select>

  <button
    onClick={() => {
      setFilterSpec("");
      setSelectedCity("All");
    }}
    className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-100 transition"
  >
    Clear
  </button>
</div>


      {/* 🔹 Doctor Preview */}
      <AnimatePresence>
        {doctorProfile && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex gap-4 items-center p-4 bg-white rounded-xl shadow-lg border border-gray-100"
          >
            <img
              src={doctorProfile.avatar}
              alt={doctorProfile.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-indigo-100"
            />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800">{doctorProfile.name}</h3>
              <p className="text-gray-600">{doctorProfile.specialization}</p>
              <p className="text-gray-500 text-sm">{doctorProfile.qualification}</p>
              <p className="text-gray-500 text-sm">
  🏥 {doctorProfile.location || "Address not available"}
</p>

              <p className="text-gray-500 text-sm">
                Experience: {doctorProfile.experience_years || "—"} yrs
              </p>

              {/* Ratings always visible */}
              <div className="flex items-center mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FiStar
                    key={i}
                    className={`text-xl cursor-pointer transition ${
                      i < tempRating ? "text-yellow-400" : "text-gray-300"
                    }`}
                    onClick={() => setTempRating(i + 1)}
                  />
                ))}
              </div>

              {/* Feedback restricted */}
              {canGiveFeedback ? (
                <button
                  onClick={() => setShowProfileDialog(true)}
                  className="mt-2 px-4 py-1.5 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  Give Feedback
                </button>
              ) : (
                <p className="mt-2 text-sm text-gray-500 italic">
                  Book appointment to give feedback
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 Booking Form */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
        <select
          value={selectedDoctor}
          onChange={(e) => {
            setSelectedDoctor(e.target.value);
            fetchDoctorProfile(e.target.value);
          }}
          className="border rounded px-3 py-2 w-full md:w-1/3 focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">Select Doctor</option>
          {filteredDoctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name} ({doc.specialization})
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-1/3 focus:ring-2 focus:ring-indigo-400"
        />

        <input
          type="text"
          placeholder="Reason for visit"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="border rounded px-3 py-2 w-full md:flex-1 focus:ring-2 focus:ring-indigo-400"
        />

        <button
          onClick={handleBook}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Book
        </button>
      </div>

      {/* 🔹 Appointment List */}
      <h3 className="text-xl font-semibold text-gray-800">Your Appointments</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {appointments.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center">No appointments yet 🕓</p>
        ) : (
          appointments.map((appt) => {
            const status = appt.status?.toLowerCase();
            const colors = {
              confirmed: "bg-green-50 border-green-400 text-green-700",
              pending: "bg-yellow-50 border-yellow-400 text-yellow-700",
              rejected: "bg-red-50 border-red-400 text-red-700",
              default: "bg-gray-50 border-gray-300 text-gray-700",
            };
            const colorSet = colors[status] || colors.default;

            return (
              <motion.div
                key={appt.id}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-xl shadow border-l-4 ${colorSet}`}
              >
                <p>
                  Doctor: <strong>{appt.doctor_name}</strong>
                </p>
                <p>
                  Status:{" "}
                  <strong className="capitalize">{appt.status || "Unknown"}</strong>
                </p>
                <p>Reason: {appt.reason}</p>
                {appt.appointment_date && (
                  <p>Date: {new Date(appt.appointment_date).toLocaleString()}</p>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {/* 🔹 Feedback Dialog */}
      <AnimatePresence>
        {showProfileDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-lg shadow-xl p-6 w-96 relative"
            >
              <button
                onClick={() => setShowProfileDialog(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <FiX size={20} />
              </button>

              <h3 className="text-xl font-bold mb-2 text-indigo-700">
                {doctorProfile?.name}
              </h3>
              <p className="text-gray-600 mb-2">{doctorProfile?.specialization}</p>
              <textarea
                placeholder="Leave feedback..."
                value={tempFeedback}
                onChange={(e) => setTempFeedback(e.target.value)}
                className="w-full border rounded-md p-2 h-24 mb-3"
              />
              <button
                onClick={() => setShowProfileDialog(false)}
                className="bg-indigo-600 text-white px-4 py-2 rounded w-full hover:bg-indigo-700 transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PatientAppointment;
