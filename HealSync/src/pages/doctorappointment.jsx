import React, { useState, useEffect } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import {
  XCircleIcon,
  CheckCircleIcon,
  PhoneIcon,
  UserIcon,
  CalendarDaysIcon,
  ChatBubbleBottomCenterTextIcon,
  MapPinIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

const API_BASE_URL = "http://localhost:5000/api/appointments";

const DoctorAppointment = () => {
  const { custom_id } = useOutletContext(); // doctor ID
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState({});

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/doctor/${custom_id}`);
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
    if (status === "confirmed" && !appointment_date)
      return alert("Select date/time before confirming");

    try {
      await axios.patch(`${API_BASE_URL}/${id}`, { status, appointment_date });
      fetchAppointments();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

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

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500 animate-pulse">
        Loading appointments...
      </div>
    );

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black mb-6 sm:mb-10 text-center">
        🩺 Doctor Dashboard
      </h2>

      <div className="grid gap-6 sm:gap-8">
        {appointments.length === 0 ? (
          <p className="text-gray-500 text-center">No appointments found.</p>
        ) : (
          appointments.map((appt) => (
            <div
              key={appt.id}
              className="backdrop-blur-lg bg-white/70 border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-4 sm:p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
            >
              {/* Patient Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1 w-full">
                <img
                  src={`http://localhost:5000/${appt.patient_photo}`}
                  alt={appt.patient_name || "Patient"}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-md border border-blue-300"
                />

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-gray-900">
                        <UserIcon className="w-5 h-5 text-blue-500" />
                        {appt.patient_name}
                      </p>

                      <div className="mt-1 space-y-1 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Gender:</span>{" "}
                          {appt.patient_gender || "N/A"}
                        </p>
                        <p>
                          <HeartIcon className="w-4 h-4 inline text-pink-500 mr-1" />
                          {appt.patient_blood_group || "Unknown"}
                        </p>
                        <p>
                          <PhoneIcon className="w-4 h-4 inline text-gray-500 mr-1" />
                          {appt.phone_number || "N/A"}
                        </p>
                        <p className="flex flex-wrap items-center gap-1">
                          <MapPinIcon className="w-4 h-4 text-gray-500" />
                          <span className="truncate max-w-[200px] sm:max-w-none">
                            {appt.patient_address || "Address not available"}
                          </span>
                        </p>
                      </div>

                      {appt.patient_about && (
                        <p className="mt-2 italic text-gray-700 text-sm flex items-center gap-1">
                          <ChatBubbleBottomCenterTextIcon className="w-4 h-4 text-blue-400" />
                          “{appt.patient_about}”
                        </p>
                      )}

                      {appt.reason && (
                        <p className="text-sm text-gray-500 mt-2">
                          <strong>Reason:</strong> {appt.reason}
                        </p>
                      )}

                      {appt.appointment_date && (
                        <p className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                          {new Date(appt.appointment_date).toLocaleString()}
                        </p>
                      )}
                    </div>

                    <span
                      className={`mt-3 sm:mt-0 inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(
                        appt.status
                      )}`}
                    >
                      {appt.status.toUpperCase()}
                    </span>
                  </div>

                  {appt.status === "pending" && (
                    <div className="mt-3 w-full sm:max-w-xs">
                      <label className="block text-xs text-gray-600 mb-1">
                        Select Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        value={dates[appt.id] || ""}
                        onChange={(e) =>
                          setDates({ ...dates, [appt.id]: e.target.value })
                        }
                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-full"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 w-full sm:w-auto justify-start sm:justify-end">
                {appt.status === "pending" && (
                  <button
                    onClick={() => updateStatus(appt.id, "confirmed")}
                    className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition shadow-sm w-full sm:w-auto"
                  >
                    <CheckCircleIcon className="w-4 h-4" /> Confirm
                  </button>
                )}
                {appt.status !== "cancelled" && (
                  <button
                    onClick={() => updateStatus(appt.id, "cancelled")}
                    className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition shadow-sm w-full sm:w-auto"
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
