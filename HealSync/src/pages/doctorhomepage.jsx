import React, { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowRightIcon,
  UserCircleIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  BellAlertIcon,
  LifebuoyIcon,
  ClipboardDocumentCheckIcon,
  HeartIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
  ChatBubbleLeftRightIcon,
  ReceiptRefundIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";

const API_BASE_URL = "http://localhost:5000";

const DoctorHomepage = () => {
  // Get custom_id safely
  const outletContext = useOutletContext() || {};
  const custom_id = outletContext.custom_id || null;

  const [doctorName, setDoctorName] = useState("Doctor");
  const [profile, setProfile] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [patientsCount, setPatientsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!custom_id) return;

    const fetchDoctorData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/doctor/${custom_id}`);
        console.log("Doctor Data:", res.data);

        // Adjust based on backend structure
        const doctorData = res.data.doctor || res.data; 
        setProfile(doctorData);

        // Name field could be full_name or name
        setDoctorName(doctorData.full_name || doctorData.name || "Doctor");

        // Example: fetch appointments & patients count if backend provides
        setAppointments(doctorData.appointments || []);
        setPatientsCount(doctorData.patientsCount || doctorData.patients?.length || 0);
      } catch (err) {
        console.error("Error fetching doctor data:", err);
        setDoctorName("Error Loading Name");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorData();
  }, [custom_id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="text-xl font-semibold text-blue-600">Loading Doctor Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <div className="space-y-6 lg:space-y-8">

        {/* Welcome / Alerts */}
        <div className="bg-white p-5 md:p-8 rounded-2xl shadow-xl border-t-4 border-indigo-600">
          <div className="flex justify-between items-start border-b pb-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                Hello, <span className="font-bold text-indigo-700">{doctorName.split(" ").slice(0, 2).join(" ")}</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Your <strong>Doctor Dashboard</strong>. Manage patients, appointments, and reports.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Doctor ID: <span className="font-mono font-medium">{custom_id || "N/A"}</span>
              </p>
            </div>
            <Link
              to="settings"
              className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition ring-1 ring-gray-300"
            >
              <Cog6ToothIcon className="w-4 h-4 mr-1 text-gray-500" /> Settings
            </Link>
          </div>

          {/* Critical Alerts */}
          <div className="p-4 bg-red-100 border border-red-400 rounded-xl flex items-start space-x-4 shadow-inner">
            <BellAlertIcon className="w-6 h-6 text-red-700 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-base font-extrabold text-red-800 uppercase tracking-wider">Pending Lab Reviews</h2>
              <p className="text-sm text-red-700 mt-1">
                You have {appointments.filter(a => a.status === "pending").length} pending lab results to review.
              </p>
              <Link
                to="appointments"
                className="mt-2 inline-flex items-center text-sm font-bold text-red-600 hover:text-red-800 transition"
              >
                View Pending Appointments <ArrowRightIcon className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Patients */}
          <Link
            to="patients"
            className="block bg-indigo-50 p-5 rounded-2xl border border-gray-200 shadow-lg transition hover:shadow-2xl hover:ring-2 hover:ring-offset-2 hover:ring-indigo-500"
          >
            <div className="flex justify-between items-center">
              <UserCircleIcon className="w-7 h-7 text-indigo-600" />
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest">Patients</p>
            </div>
            <div className="mt-3 border-t pt-3 border-gray-200">
              <span className="text-3xl font-extrabold text-indigo-600">{patientsCount}</span>
              <span className="text-sm font-semibold text-gray-500 ml-2">registered</span>
            </div>
          </Link>

          {/* Upcoming Appointment */}
          <Link
            to="appointments"
            className="block bg-green-50 p-5 rounded-2xl border border-gray-200 shadow-lg transition hover:shadow-2xl hover:ring-2 hover:ring-offset-2 hover:ring-green-500"
          >
            <div className="flex justify-between items-center">
              <CalendarDaysIcon className="w-7 h-7 text-green-600" />
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest">Next Appointment</p>
            </div>
            <div className="mt-3 border-t pt-3 border-gray-200">
              <span className="text-3xl font-extrabold text-green-600">
                {appointments.length > 0 ? new Date(appointments[0].date).toDateString() : "N/A"}
              </span>
            </div>
          </Link>

          {/* Profile Completion */}
          <Link
            to="profile"
            className="block bg-yellow-50 p-5 rounded-2xl border border-gray-200 shadow-lg transition hover:shadow-2xl hover:ring-2 hover:ring-offset-2 hover:ring-yellow-500"
          >
            <div className="flex justify-between items-center">
              <ClipboardDocumentCheckIcon className="w-7 h-7 text-yellow-600" />
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest">Profile Completion</p>
            </div>
            <div className="mt-3 border-t pt-3 border-gray-200">
              <span className="text-3xl font-extrabold text-yellow-600">
                {profile.full_name && profile.specialization ? "100%" : "50%"}
              </span>
            </div>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="bg-white p-5 rounded-2xl shadow-xl border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="appointments" className="flex flex-col p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition group">
              <div className="flex items-center space-x-3 mb-2">
                <CalendarDaysIcon className="w-5 h-5 text-green-600" />
                <p className="text-xs font-medium text-gray-500 uppercase">Upcoming Appts</p>
              </div>
              <p className="text-lg font-extrabold text-gray-800">{appointments.length}</p>
            </Link>

            <Link to="patients" className="flex flex-col p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition group">
              <div className="flex items-center space-x-3 mb-2">
                <UserCircleIcon className="w-5 h-5 text-indigo-600" />
                <p className="text-xs font-medium text-gray-500 uppercase">Patients</p>
              </div>
              <p className="text-lg font-extrabold text-gray-800">{patientsCount}</p>
            </Link>

            <Link to="messages" className="flex flex-col p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition group">
              <div className="flex items-center space-x-3 mb-2">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-indigo-700" />
                <p className="text-xs font-medium text-gray-500 uppercase">Messages</p>
              </div>
              <p className="text-lg font-extrabold text-gray-800">5</p>
            </Link>

            <Link to="billing" className="flex flex-col p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition group">
              <div className="flex items-center space-x-3 mb-2">
                <ReceiptRefundIcon className="w-5 h-5 text-teal-600" />
                <p className="text-xs font-medium text-gray-500 uppercase">Pending Bills</p>
              </div>
              <p className="text-lg font-extrabold text-gray-800">2</p>
            </Link>
          </div>
        </div>

        {/* Core Modules */}
        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Core Doctor Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Profile, Appointments, Patients, Billing, Messages, Support */}
          {[
            { to: "profile", icon: UserCircleIcon, label: "Doctor Profile", desc: "Manage your details, specialization, and contact info." },
            { to: "appointments", icon: CalendarDaysIcon, label: "Appointments", desc: "View, manage, and update patient appointments." },
            { to: "patients", icon: UserCircleIcon, label: "Patients", desc: "View patient list, history, and health records." },
            { to: "billing", icon: ReceiptRefundIcon, label: "Billing & Payments", desc: "View invoices, manage payments and insurance claims." },
            { to: "messages", icon: ChatBubbleLeftRightIcon, label: "Messages", desc: "Communicate securely with patients and team members." },
            { to: "support", icon: LifebuoyIcon, label: "Support", desc: "Access FAQs, guides, and technical support." },
          ].map((mod, i) => (
            <Link key={i} to={mod.to} className="flex items-center p-4 sm:p-5 bg-white border border-gray-200 rounded-xl hover:bg-indigo-50 shadow-sm">
              <mod.icon className="w-7 h-7 text-indigo-700 mr-4" />
              <div>
                <span className="font-semibold text-gray-800 text-base">{mod.label}</span>
                <p className="text-xs text-gray-500 mt-1">{mod.desc}</p>
              </div>
              <ArrowRightIcon className="w-5 h-5 ml-auto text-gray-400" />
            </Link>
          ))}
        </div>

        {/* Footer Security */}
        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200 text-sm text-gray-700 mt-8 shadow-inner">
          <div className="flex justify-between items-center flex-wrap">
            <p className="flex items-center text-xs sm:text-sm font-medium mb-2 sm:mb-0 text-indigo-700">
              <ShieldCheckIcon className="w-4 h-4 inline mr-2 text-green-600" />
              <strong>Data Security:</strong> All doctor and patient data is secure and compliant with HIPAA & GDPR.
            </p>
            <Link to="settings/security" className="font-bold text-indigo-600 hover:text-indigo-800 transition text-xs sm:text-sm">
              View Compliance Details →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DoctorHomepage;
