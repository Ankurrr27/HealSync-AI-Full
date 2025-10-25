import React, { useState, useEffect } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import {
  ClockIcon,
  XCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const API_BASE_URL = "http://localhost:5000/api/appointments";

const DoctorAppointment = () => {
  const { custom_id } = useOutletContext(); // doctor id
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState({}); // track selected dates per appointment

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/doctor/${custom_id}`);
      // Sort appointments by date ascending (earliest first)
      const sortedAppointments = res.data.sort(
        (a, b) => new Date(a.appointment_date) - new Date(b.appointment_date)
      );
      setAppointments(sortedAppointments);
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

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500">
        Loading appointments...
      </div>
    );

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Patient Appointment Requests
      </h2>

      <div className="grid gap-4">
        {appointments.length === 0 ? (
          <p className="text-gray-500">No appointments found.</p>
        ) : (
          appointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="flex-1 space-y-1">
                <p className="text-md font-semibold text-gray-800">
                  Patient:{" "}
                  <span className="font-medium">{appt.patient_name}</span>
                </p>
                <p className="text-xs text-gray-500">Reason: {appt.reason}</p>
                {appt.appointment_date && (
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <ClockIcon className="w-4 h-4 text-gray-400" />
                    {new Date(appt.appointment_date).toLocaleString()}
                  </p>
                )}
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-1 ${getStatusStyle(
                    appt.status
                  )}`}
                >
                  {appt.status.toUpperCase()}
                </span>

                {appt.status === "pending" && (
                  <input
                    type="datetime-local"
                    value={dates[appt.id] || ""}
                    onChange={(e) =>
                      setDates({ ...dates, [appt.id]: e.target.value })
                    }
                    className="mt-2 border rounded px-2 py-1 text-xs"
                  />
                )}
              </div>

              <div className="flex gap-2">
                {appt.status === "pending" && (
                  <button
                    onClick={() => updateStatus(appt.id, "confirmed")}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition flex items-center gap-1"
                  >
                    <CheckCircleIcon className="w-4 h-4" /> Confirm
                  </button>
                )}
                {appt.status !== "cancelled" && (
                  <button
                    onClick={() => updateStatus(appt.id, "cancelled")}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition flex items-center gap-1"
                  >
                    <XCircleIcon className="w-4 h-4" /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorAppointment;
