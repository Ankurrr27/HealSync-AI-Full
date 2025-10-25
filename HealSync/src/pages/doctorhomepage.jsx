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
  ClockIcon
} from "@heroicons/react/24/outline";

const API_BASE_URL = "http://localhost:5000";

// Summary Card
const SummaryCard = ({ label, value, icon: Icon, colorClass, bgClass, link }) => (
  <Link to={link} className={`${bgClass} p-5 rounded-2xl border border-gray-200 shadow hover:shadow-lg transition transform hover:-translate-y-1 flex flex-col`}>
    <div className="flex items-center justify-between mb-2">
      <Icon className={`w-7 h-7 ${colorClass}`} />
      <span className="text-xs font-semibold text-gray-500 uppercase">{label}</span>
    </div>
    <span className={`text-2xl font-bold ${colorClass}`}>{value}</span>
  </Link>
);

// Appointment Card
const AppointmentCard = ({ appt }) => (
  <div className="bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 flex flex-col space-y-1">
    <div className="flex justify-between items-center">
      <span className="font-semibold text-gray-800">{appt.patient_name}</span>
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${appt.status === 'confirmed' ? 'bg-green-100 text-green-800' : appt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
        {appt.status.toUpperCase()}
      </span>
    </div>
    <p className="text-xs text-gray-500">Reason: {appt.reason}</p>
    {appt.appointment_date && (
      <p className="text-xs text-gray-500 flex items-center gap-1">
        <ClockIcon className="w-3 h-3 text-gray-400" />
        {new Date(appt.appointment_date).toLocaleString()}
      </p>
    )}
    <Link to={`/appointments/${appt.id}`} className="text-indigo-600 text-sm font-semibold flex items-center mt-1">
      View Details <ArrowRightIcon className="w-3 h-3 ml-1" />
    </Link>
  </div>
);

// Patient Card
const PatientCard = ({ patient }) => (
  <div className="bg-white p-4 rounded-2xl shadow-md flex flex-col items-center space-y-2 hover:shadow-lg transition transform hover:-translate-y-1">
    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
      {patient.profile_image ? (
        <img src={`${API_BASE_URL}/${patient.profile_image}`} alt={patient.full_name} className="w-full h-full object-cover" />
      ) : (
        <UserCircleIcon className="w-14 h-14 text-gray-400" />
      )}
    </div>
    <h3 className="text-sm font-semibold text-gray-800">{patient.full_name}</h3>
    <p className="text-xs text-gray-500">{patient.age ? `${patient.age} yrs` : ""} {patient.gender ? `| ${patient.gender}` : ""}</p>
    <Link to={`/patients/${patient.custom_id}`} className="text-indigo-600 text-sm font-semibold flex items-center mt-1">
      View Profile <ArrowRightIcon className="w-3 h-3 ml-1" />
    </Link>
  </div>
);

const DoctorHomepage = () => {
  const { custom_id } = useOutletContext() || {};
  const [doctor, setDoctor] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!custom_id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const profileRes = await axios.get(`${API_BASE_URL}/api/doctor/${custom_id}`);
        setDoctor(profileRes.data);

        const apptRes = await axios.get(`${API_BASE_URL}/api/appointments/doctor/${custom_id}`);
        setAppointments(apptRes.data || []);

        const patientIds = [...new Set(apptRes.data.map(a => a.user_id))];
        const patientProfiles = await Promise.all(patientIds.map(id => axios.get(`${API_BASE_URL}/api/profile/${id}`).then(r => r.data)));
        setPatients(patientProfiles);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [custom_id]);

  if (loading) return <div className="p-4 text-center text-gray-500">Loading dashboard...</div>;

  const summaryData = [
    { label: "Patients", value: patients.length, icon: UserCircleIcon, colorClass: "text-indigo-600", bgClass: "bg-indigo-50", link: "#patients" },
    { label: "Appointments", value: appointments.length, icon: CalendarDaysIcon, colorClass: "text-green-600", bgClass: "bg-green-50", link: "#appointments" },
    { label: "Profile Completion", value: doctor.full_name && doctor.specialization ? "100%" : "50%", icon: ClipboardDocumentCheckIcon, colorClass: "text-yellow-600", bgClass: "bg-yellow-50", link: "#profile" },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen space-y-6">

      {/* Doctor Info */}
      <div className="bg-white p-6 rounded-2xl shadow-xl flex justify-between items-center border border-gray-200">
        <div className="flex items-center space-x-5">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
            {doctor.profile_image ? (
              <img src={`${API_BASE_URL}/${doctor.profile_image}`} alt="Doctor" className="w-full h-full object-cover" />
            ) : <UserCircleIcon className="w-20 h-20 text-gray-400" />}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{doctor.full_name}</h2>
            <p className="text-sm text-gray-500">{doctor.specialization || "Specialization not set"}</p>
            <p className="text-xs text-gray-400 mt-1">Email: {doctor.email || "N/A"}</p>
            <p className="text-xs text-gray-400">Phone: {doctor.phone || "N/A"}</p>
          </div>
        </div>
        <Link to="settings" className="text-xs text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition flex items-center">
          <Cog6ToothIcon className="w-4 h-4 mr-1" /> Settings
        </Link>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summaryData.map((item, idx) => <SummaryCard key={idx} {...item} />)}
      </div>

      {/* Appointments */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Upcoming Appointments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointments.length > 0 ? appointments.map(appt => <AppointmentCard key={appt.id} appt={appt} />) : <p className="text-gray-500">No upcoming appointments</p>}
        </div>
      </div>

      {/* Patients */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Your Patients</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {patients.length > 0 ? patients.map(p => <PatientCard key={p.custom_id} patient={p} />) : <p className="text-gray-500">No patients found</p>}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 bg-gray-100 rounded-xl border border-gray-200 text-xs text-gray-700 shadow-inner mt-6 flex items-center">
        <ShieldCheckIcon className="w-4 h-4 mr-1 text-green-600" /> Data is HIPAA/GDPR compliant
      </div>
    </div>
  );
};

export default DoctorHomepage;
