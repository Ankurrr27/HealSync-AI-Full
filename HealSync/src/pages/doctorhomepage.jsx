import React, { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import axios from "axios";
import {
  UserCircleIcon,
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  ArrowRightIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

const API_BASE_URL = "http://localhost:5000";

const SummaryCard = ({
  label,
  value,
  icon: Icon,
  colorClass,
  bgClass,
  link,
}) => (
  <Link
    to={link}
    className={`group relative overflow-hidden ${bgClass} rounded-2xl p-5 border border-gray-100 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200`}
  >
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-white/40 to-transparent blur-sm"></div>
    <div className="relative z-10 flex items-center justify-between mb-2">
      <Icon className={`w-7 h-7 ${colorClass}`} />
      <span className="text-xs font-semibold text-gray-500 uppercase">
        {label}
      </span>
    </div>
    <div className="relative z-10 text-2xl font-bold text-gray-900">
      {value}
    </div>
  </Link>
);

const AppointmentCard = ({ appt }) => (
  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100">
    <div className="flex justify-between items-center mb-1">
      <span className="font-semibold text-gray-800">{appt.patient_name}</span>
      <span
        className={`text-xs px-2 py-1 rounded-full ${
          appt.status === "confirmed"
            ? "bg-green-100 text-green-700"
            : appt.status === "pending"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {appt.status?.toUpperCase()}
      </span>
    </div>
    <p className="text-xs text-gray-500 mb-1">Reason: {appt.reason}</p>
    {appt.appointment_date && (
      <p className="text-xs text-gray-500 flex items-center gap-2">
        <ClockIcon className="w-3 h-3 text-gray-400" />
        {new Date(appt.appointment_date).toLocaleString()}
      </p>
    )}
    <Link
      to={`/appointments/${appt.id}`}
      className="mt-3 text-indigo-600 text-sm font-semibold flex items-center hover:underline"
    >
      View Details <ArrowRightIcon className="w-3 h-3 ml-1" />
    </Link>
  </div>
);

const DoctorProfileCard = ({ doctor }) => (
  <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-6">
    {/* Profile Image */}
    <div className="flex-shrink-0">
      <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-2 border-indigo-100 flex items-center justify-center shadow-sm">
        {doctor.profile_image ? (
          <img
            src={`${API_BASE_URL}/${doctor.profile_image}`}
            alt="Doctor"
            className="w-full h-full object-cover"
          />
        ) : (
          <UserCircleIcon className="w-20 h-20 text-gray-400" />
        )}
      </div>
    </div>

    {/* Details */}
    <div className="flex-1 space-y-2 text-center md:text-left">
      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800">
        {doctor.full_name || "Dr. Unknown"}
      </h2>
      <p className="text-sm text-indigo-600 font-semibold">
        {doctor.specialization || "Specialization not set"}
      </p>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center md:justify-start text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <EnvelopeIcon className="w-4 h-4 text-gray-400" />
          {doctor.email || "Not available"}
        </div>
        <div className="flex items-center gap-2">
          <PhoneIcon className="w-4 h-4 text-gray-400" />
          {doctor.contact_number || "No contact"}
        </div>
      </div>

      {/* About Section */}
      {doctor.about && (
        <div className="mt-3 bg-indigo-50/70 rounded-xl p-3 border border-indigo-100 text-gray-700 text-sm leading-relaxed">
          <h4 className="font-semibold text-indigo-700 mb-1">About</h4>
          <p>{doctor.about}</p>
        </div>
      )}
    </div>
  </div>
);

const DoctorHomepage = () => {
  const { custom_id } = useOutletContext() || {};
  const [doctor, setDoctor] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!custom_id) return;
    const fetchData = async () => {
      try {
        const profileRes = await axios.get(
          `${API_BASE_URL}/api/doctor/${custom_id}`
        );
        setDoctor(profileRes.data || {});
        const apptRes = await axios.get(
          `${API_BASE_URL}/api/appointments/doctor/${custom_id}`
        );
        setAppointments(apptRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [custom_id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-100">
        <div className="animate-pulse text-indigo-600 font-semibold">
          Loading Dashboard...
        </div>
      </div>
    );

  const summaryData = [
    {
      label: "Appointments",
      value: appointments.length,
      icon: CalendarDaysIcon,
      colorClass: "text-green-600",
      bgClass: "bg-green-50",
      link: "#appointments",
    },
    {
      label: "Profile",
      value: doctor.full_name ? "Complete" : "Incomplete",
      icon: ClipboardDocumentCheckIcon,
      colorClass: "text-yellow-600",
      bgClass: "bg-yellow-50",
      link: "#profile",
    },
  ];

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-screen space-y-10">
      {/* Profile Section */}
      <DoctorProfileCard doctor={doctor} />

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {summaryData.map((item, idx) => (
          <SummaryCard key={idx} {...item} />
        ))}
      </div>

      {/* Appointments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            Upcoming Appointments
          </h3>
        
         
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointments.length > 0 ? (
            appointments.map((appt) => (
              <AppointmentCard key={appt.id} appt={appt} />
            ))
          ) : (
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border text-gray-500 text-center">
              No upcoming appointments
            </div>
          )}
        </div>
      </div>

      {/* Compliance / Footer */}
      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center text-xs text-gray-500 gap-2">
        <ShieldCheckIcon className="w-4 h-4 text-green-600" />
        HIPAA / GDPR Compliant | Data Secured
      </div>
    </div>
  );
};

export default DoctorHomepage;
