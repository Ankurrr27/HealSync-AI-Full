import React, { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import axios from "axios";
import {
  DocumentTextIcon,
  CalendarDaysIcon,
  UserCircleIcon,
  ClipboardDocumentCheckIcon,
  HeartIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const API_BASE_URL = "http://localhost:5000/api"; // For API calls
const STATIC_BASE_URL = "http://localhost:5000"; // For images

// Reusable Info Card
const InfoCard = ({
  label,
  value,
  unit,
  description,
  icon: Icon,
  color,
  bg,
  to,
}) => (
  <Link
    to={to}
    className={`block ${bg} p-5 rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition duration-500 transform hover:-translate-y-1`}
  >
    <div className="flex justify-between items-center">
      <Icon className={`w-7 h-7 ${color}`} />
      <p className="text-xs font-semibold text-gray-600 uppercase">{label}</p>
    </div>
    <div className="mt-3 border-t pt-3 border-gray-200">
      <span className={`text-3xl font-extrabold ${color}`}>{value}</span>
      {unit && <span className="text-sm text-gray-500 ml-2">{unit}</span>}
    </div>
    {description && (
      <p className="text-sm text-gray-500 mt-2 truncate">{description}</p>
    )}
  </Link>
);

// Reusable Quick Action Button
const ActionButton = ({ label, to, icon: Icon, bg, color }) => (
  <Link
    to={to}
    className={`flex items-center p-4 ${bg} rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1`}
  >
    <Icon className={`w-6 h-6 ${color} mr-3`} />
    <span className="font-semibold text-gray-700 group-hover:text-gray-900">
      {label}
    </span>
  </Link>
);

// Doctor Card
const DoctorCard = ({ doctor }) => (
  <div className="bg-white p-4 rounded-2xl shadow-md flex items-center space-x-4 hover:shadow-xl transition transform hover:-translate-y-1">
    <img
      src={
        doctor.profile_image
          ? `${STATIC_BASE_URL}/${doctor.profile_image}`
          : "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
      }
      alt={doctor.full_name}
      className="w-20 h-20 rounded-full border-2 border-indigo-100 object-cover"
    />

    <div className="flex-1">
      <h3 className="text-lg font-bold text-gray-800">{doctor.full_name}</h3>
      <p className="text-sm text-gray-500">
        {doctor.specialization || "General Practitioner"}
      </p>
      <p className="text-xs text-gray-600">
        🏥 {doctor.clinic_address || doctor.location || "Address not available"}
      </p>
      <p className="text-xs text-gray-400 mt-1">
        Next Appointment:{" "}
        {doctor.next_appointment_date
          ? new Date(doctor.next_appointment_date).toLocaleDateString()
          : "N/A"}
      </p>
    </div>

    <Link
      to={`/doctor/${doctor.custom_id}`}
      className="text-indigo-600 font-semibold hover:underline text-sm"
    >
      View Profile
    </Link>
  </div>
);

const PatientHomepage = () => {
  const { custom_id } = useOutletContext();

  const [userProfile, setUserProfile] = useState(null);
  const [userRecords, setUserRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [frequentDoctors, setFrequentDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!custom_id) return;

    const fetchData = async () => {
      setLoading(true);
      setError(false);
      try {
        const [profileRes, recordsRes, appointmentsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/profile/${custom_id}`),
          axios.get(`${API_BASE_URL}/records/${custom_id}`),
          axios.get(`${API_BASE_URL}/appointments/user/${custom_id}`),
        ]);

        setUserProfile(profileRes.data);
        setUserRecords(recordsRes.data);
        setAppointments(appointmentsRes.data);

        const doctorIds = [
          ...new Set(appointmentsRes.data.map((a) => a.doctor_id)),
        ];
        const doctorProfiles = await Promise.all(
          doctorIds.map((id) =>
            axios.get(`${API_BASE_URL}/doctor/${id}`).then((res) => {
              const doctorAppointments = appointmentsRes.data.filter(
                (a) => a.doctor_id === id
              );
              const nextAppointment = doctorAppointments.sort(
                (a, b) =>
                  new Date(a.appointment_date) - new Date(b.appointment_date)
              )[0];
              return {
                ...res.data,
                next_appointment_date: nextAppointment?.appointment_date,
              };
            })
          )
        );
        setFrequentDoctors(doctorProfiles);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [custom_id]);

  if (loading)
    return (
      <div className="p-4 max-w-6xl mx-auto space-y-4">
        {/* Skeleton for Welcome Section */}
        <div className="bg-gray-200 rounded-2xl h-24 animate-pulse"></div>

        {/* Skeleton for Profile Card */}
        <div className="bg-gray-200 rounded-2xl h-32 md:h-36 animate-pulse"></div>

        {/* Skeleton for Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 mt-4">
          {Array(4)
            .fill(0)
            .map((_, idx) => (
              <div
                key={idx}
                className="bg-gray-200 h-28 rounded-xl animate-pulse"
              ></div>
            ))}
        </div>

        {/* Skeleton for Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {Array(4)
            .fill(0)
            .map((_, idx) => (
              <div
                key={idx}
                className="bg-gray-200 h-16 rounded-xl animate-pulse"
              ></div>
            ))}
        </div>
      </div>
    );

  if (error)
    return (
      <div className="p-4 text-red-600 text-center">Failed to load data.</div>
    );

  const name = userProfile?.full_name || "Patient Name";
  const nextAppointment = appointments[0];
  const daysToNextAppointment = nextAppointment
    ? Math.max(
        0,
        Math.ceil(
          (new Date(nextAppointment.appointment_date) - new Date()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : null;

  const summaryData = [
    {
      label: "Medical Records",
      value: userRecords.length,
      unit: "documents",
      to: "records",
      icon: DocumentTextIcon,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      description: "Latest lab results, prescriptions and primary care notes.",
    },
    {
      label: "Next Appointment",
      value: nextAppointment
        ? new Date(nextAppointment.appointment_date).toLocaleDateString()
        : "N/A",
      unit: nextAppointment
        ? new Date(nextAppointment.appointment_date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
      to: "appointments",
      icon: CalendarDaysIcon,
      color: "text-green-600",
      bg: "bg-green-50",
      description: nextAppointment
        ? `In ${daysToNextAppointment} days with Dr. ${nextAppointment.doctor_id}`
        : "No upcoming appointments",
    },
    {
      label: "Profile Completion",
      value: userProfile ? "75%" : "0%",
      unit: "complete",
      to: "profile",
      icon: ClipboardDocumentCheckIcon,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      description: "Update insurance, emergency contacts, and personal info.",
    },
    {
      label: "Latest Lab Result",
      value: userRecords[0]?.file_name || "N/A",
      unit: "",
      to: "records",
      icon: HeartIcon,
      color: "text-rose-600",
      bg: "bg-rose-50",
      description: userRecords[0]
        ? `Checked on ${new Date(
            userRecords[0].created_at
          ).toLocaleDateString()}`
        : "No lab records yet",
    },
  ];

  const quickActions = [
    {
      label: "Book Appointment",
      to: "appointments",
      icon: CalendarDaysIcon,
      bg: "bg-blue-50",
      color: "text-blue-600",
    },
    {
      label: "View Records",
      to: "records",
      icon: DocumentTextIcon,
      bg: "bg-indigo-50",
      color: "text-indigo-600",
    },
    {
      label: "Update Profile",
      to: "profile",
      icon: UserCircleIcon,
      bg: "bg-yellow-50",
      color: "text-yellow-600",
    },
    {
      label: "Billing & Payments",
      to: "",
      icon: CurrencyDollarIcon,
      bg: "bg-teal-50",
      color: "text-teal-600",
    },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto bg-gray-50 min-h-screen space-y-6">
      {/* Welcome Section */}
      <div className="bg-white p-5 md:p-8 rounded-2xl shadow-xl border-t-4 border-indigo-600 flex justify-between items-start animate-fadeIn">
        <div className="flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Hello, <span className="text-indigo-700">{name}</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Your Personal Health Dashboard
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Patient ID:{" "}
            <span className="font-mono font-medium">{custom_id}</span>
          </p>
        </div>
        <Link
          
          className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition ring-1 ring-gray-300"
        >
          <Cog6ToothIcon className="w-4 h-4 mr-1 text-gray-500" /> Settings
        </Link>
      </div>

      {/* Profile Card */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 animate-fadeIn">
        <div className="flex-shrink-0">
          <img
            src={
              userProfile?.profile_image
                ? `${STATIC_BASE_URL}/${
                    userProfile.profile_image.startsWith("uploads/")
                      ? userProfile.profile_image
                      : `uploads/${userProfile.profile_image}`
                  }`
                : "https://via.placeholder.com/120"
            }
            alt="Profile"
            className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-indigo-100 shadow-sm object-cover"
          />
        </div>
        <div className="flex-1 space-y-1">
          <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
          <p className="text-sm text-gray-500">
            Email:{" "}
            <span className="font-medium">
              {userProfile?.email || "Not provided"}
            </span>
          </p>
          <p className="text-sm text-gray-500">
            Contact Number:{" "}
            <span className="font-medium">
              {userProfile?.mobile_number || "Not linked yet"}
            </span>
          </p>

          <p className="text-sm text-gray-500">
            Primary Doctor:{" "}
            <span className="font-medium">
              {userProfile?.primary_doctor || "N/A"}
            </span>
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="profile"
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl shadow hover:bg-indigo-700 transition text-sm font-semibold"
            >
              Edit Profile
            </Link>
            <Link
              to="appointments"
              className="bg-green-600 text-white px-4 py-2 rounded-xl shadow hover:bg-green-700 transition text-sm font-semibold"
            >
              View Appointments
            </Link>
            <Link
              to="records"
              className="bg-purple-600 text-white px-4 py-2 rounded-xl shadow hover:bg-purple-700 transition text-sm font-semibold"
            >
              View Records
            </Link>
          </div>
        </div>
      </div>

      {/* Frequently Visited Doctors */}
      {frequentDoctors.length > 0 && (
        <div className="space-y-4 animate-fadeIn">
          <h2 className="text-xl font-bold text-gray-800">
            Frequently Visited Doctors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {frequentDoctors.map((doctor) => (
              <DoctorCard key={doctor.custom_id} doctor={doctor} />
            ))}
          </div>
        </div>
      )}

      {/* Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 animate-fadeIn">
        {summaryData.map((item, idx) => (
          <Link
            key={idx}
            to={item.to}
            className={`block ${item.bg} p-4 rounded-xl border border-gray-200 shadow hover:shadow-lg transition transform hover:-translate-y-1`}
          >
            <div className="flex justify-between items-center">
              <item.icon className={`w-6 h-6 ${item.color}`} />
              <p className="text-[10px] font-semibold text-gray-600 uppercase">
                {item.label}
              </p>
            </div>
            <div className="mt-2 border-t pt-2 border-gray-200 flex items-baseline">
              <span className={`text-2xl font-bold ${item.color}`}>
                {item.value}
              </span>
              {item.unit && (
                <span className="text-xs text-gray-500 ml-1">{item.unit}</span>
              )}
            </div>
            {item.description && (
              <p className="text-xs text-gray-500 mt-1 truncate">
                {item.description}
              </p>
            )}
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 animate-fadeIn">
        {quickActions.map((action, idx) => (
          <ActionButton key={idx} {...action} />
        ))}
      </div>
    </div>
  );
};

export default PatientHomepage;
