import React, { useState, useEffect } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000/api/appointments";

const DoctorAppointment = () => {
  const { custom_id } = useOutletContext(); // doctor id
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState({}); // track selected dates per appointment

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/doctor/${custom_id}`);
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    const appointment_date = status === "confirmed" ? dates[id] : null;

    if (status === "confirmed" && !appointment_date) {
      return alert("Select a date/time before confirming");
    }

    try {
      await axios.patch(`${API_BASE_URL}/${id}`, { status, appointment_date });
      fetchAppointments();
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Patient Appointment Requests</h2>

      <div className="space-y-2">
        {appointments.length === 0 ? (
          <p>No appointments</p>
        ) : appointments.map(appt => (
          <div key={appt.id} className="p-3 border rounded flex justify-between items-center">
            <div>
              <p>Patient: <strong>{appt.patient_name}</strong></p>
              <p>Status: <strong>{appt.status}</strong></p>
              <p>Reason: {appt.reason}</p>
              {appt.appointment_date && (
                <p>Date: {new Date(appt.appointment_date).toLocaleString()}</p>
              )}
              {appt.status === "pending" && (
                <input
                  type="datetime-local"
                  value={dates[appt.id] || ""}
                  onChange={(e) => setDates({ ...dates, [appt.id]: e.target.value })}
                  className="border rounded px-2 py-1 mt-2"
                />
              )}
            </div>
            <div className="flex gap-2">
              {appt.status === "pending" && (
                <button
                  onClick={() => updateStatus(appt.id, "confirmed")}
                  className="bg-green-600 text-white px-2 py-1 rounded"
                >
                  Confirm
                </button>
              )}
              {appt.status !== "cancelled" && (
                <button
                  onClick={() => updateStatus(appt.id, "cancelled")}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAppointment;
