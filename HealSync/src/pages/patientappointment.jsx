import React, { useState, useEffect } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000/api/appointments";

const PatientAppointment = () => {
  const { custom_id } = useOutletContext();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [reason, setReason] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/user/${custom_id}`);
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/doctors`);
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
    setLoading(false);
  }, []);

  const handleBook = async () => {
    if (!selectedDoctor || !reason || !appointmentDate) {
      return alert("Select doctor, reason, and appointment date");
    }

    try {
      await axios.post(`${API_BASE_URL}/book`, {
        user_id: custom_id,
        doctor_id: selectedDoctor,
        reason,
        appointment_date: appointmentDate,
      });
      setSelectedDoctor("");
      setReason("");
      setAppointmentDate("");
      fetchAppointments();
      alert("Appointment requested successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to book appointment");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Book an Appointment</h2>

      <div className="flex gap-4 mb-4">
        <select
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
          className="border rounded px-3 py-2"
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
          className="border rounded px-3 py-2"
        />

        <input
          type="text"
          placeholder="Reason for visit"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />

        <button
          onClick={handleBook}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Book
        </button>
      </div>

      <h3 className="text-lg font-bold mb-2">Your Appointments</h3>
      <div className="space-y-2">
        {appointments.length === 0 ? (
          <p>No appointments yet</p>
        ) : (
          appointments.map((appt) => (
            <div key={appt.id} className="p-3 border rounded flex justify-between">
              <div>
                <p>
                  Doctor: <strong>{appt.doctor_name}</strong>
                </p>
                <p>Status: <strong>{appt.status}</strong></p>
                <p>Reason: {appt.reason}</p>
                {appt.appointment_date && (
                  <p>Date: {new Date(appt.appointment_date).toLocaleString()}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientAppointment;
