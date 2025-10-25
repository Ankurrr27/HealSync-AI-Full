import React, { useState, useEffect } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";


const API_BASE_URL = "http://localhost:5000/api"; // For API calls
const STATIC_BASE_URL = "http://localhost:5000"; // For images

const PatientAppointment = () => {
  const { custom_id } = useOutletContext();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [reason, setReason] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/appointments/user/${custom_id}`);
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/appointments/doctors`);
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDoctorProfile = async (doctorId) => {
    if (!doctorId) {
      setDoctorProfile(null);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE_URL}/doctor/${doctorId}`);
      setDoctorProfile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    Promise.all([fetchAppointments(), fetchDoctors()]).finally(() => setLoading(false));
  }, []);

  const handleBook = async () => {
    if (!selectedDoctor || !reason || !appointmentDate) {
      return alert("Select doctor, reason, and appointment date");
    }
    try {
      await axios.post(`${API_BASE_URL}/appointments/book`, {
        user_id: custom_id,
        doctor_id: selectedDoctor,
        reason,
        appointment_date: appointmentDate,
      });
      setSelectedDoctor("");
      setDoctorProfile(null);
      setReason("");
      setAppointmentDate("");
      fetchAppointments();
      alert("Appointment requested successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to book appointment");
    }
  };

  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    setSelectedDoctor(doctorId);
    fetchDoctorProfile(doctorId);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-indigo-400 border-dashed rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Book an Appointment</h2>

      {/* Doctor Profile Preview */}
      {doctorProfile && (
        <div className="flex gap-4 items-center p-4 bg-white rounded-xl shadow hover:shadow-lg transition animate-fadeIn">
          {doctorProfile.profile_image && (
            <img
              src={`${STATIC_BASE_URL}/${doctorProfile.profile_image}`}
              alt={doctorProfile.full_name}
              className="w-20 h-20 rounded-full object-cover border-2 border-indigo-100"
            />
          )}
          <div>
            <h3 className="text-lg font-bold text-gray-800">{doctorProfile.full_name}</h3>
            <p className="text-gray-600">{doctorProfile.specialization}</p>
            <p className="text-gray-500">{doctorProfile.qualification}</p>
            <p className="text-gray-500">Experience: {doctorProfile.experience_years} yrs</p>
          </div>
        </div>
      )}

      {/* Booking Form */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-xl shadow hover:shadow-lg transition animate-fadeIn">
        <select
          value={selectedDoctor}
          onChange={handleDoctorChange}
          className="border rounded px-3 py-2 w-full md:w-1/3"
        >
          <option value="">Select Doctor</option>
          {doctors.map((doc) => (
            <option key={doc.custom_id} value={doc.custom_id}>
              {doc.full_name} ({doc.specialization})
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

      {/* Patient Appointments */}
      <h3 className="text-xl font-bold text-gray-800">Your Appointments</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {appointments.length === 0 ? (
          <p className="text-gray-500 col-span-full">No appointments yet</p>
        ) : (
          appointments.map((appt) => {
            // Status-based colors
            let bgColor = "";
            let textColor = "";
            let borderColor = "";

            switch (appt.status.toLowerCase()) {
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
                break;
            }

            return (
              <div
                key={appt.id}
                className={`flex gap-4 items-center p-4 rounded-xl shadow border-l-4 transition hover:shadow-md animate-fadeIn ${bgColor} ${borderColor}`}
              >
                {appt.doctor_profile_image && (
                  <img
                    src={`${STATIC_BASE_URL}/${appt.doctor_profile_image}`}
                    alt={appt.doctor_name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100"
                  />
                )}
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
