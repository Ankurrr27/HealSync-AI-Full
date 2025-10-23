import React, { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import axios from "axios";
import {
    ArrowRightIcon,
    DocumentTextIcon,
    CalendarDaysIcon,
    UserCircleIcon,
    BellAlertIcon,
    LifebuoyIcon, 
    ClipboardDocumentCheckIcon,
    ShieldCheckIcon,
    HeartIcon, 
    CurrencyDollarIcon, 
    Cog6ToothIcon, 
    ChatBubbleLeftRightIcon, // New icon for communication
    ReceiptRefundIcon // New icon for billing module
} from "@heroicons/react/24/outline";

// IMPORTANT: Define your backend base URL
const API_BASE_URL = "http://localhost:5000";

// --- MOCK DATA FOR THE CORE DASHBOARD CARDS ---
const mockSummaryData = [
    { 
        label: "Medical Records", 
        value: 18, 
        unit: "documents updated", 
        to: "records", 
        icon: DocumentTextIcon, 
        color: "text-indigo-600",
        bg: "bg-indigo-50",
        description: "Latest lab results and primary care notes available for review."
    },
    { 
        label: "Next Appointment", 
        value: "Nov 5, 2025", 
        unit: "10:00 AM",
        to: "appointments", 
        icon: CalendarDaysIcon, 
        color: "text-green-600",
        bg: "bg-green-50",
        description: "Dr. Sharma, scheduled for a routine annual telehealth visit."
    },
    { 
        label: "Profile Completion", 
        value: "75%", 
        unit: "complete", 
        to: "profile", 
        icon: ClipboardDocumentCheckIcon, 
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        description: "Action required: Insurance and emergency contact details need updating."
    },
];

// --- MOCK DATA FOR THE QUICK STATS CARD ---
const mockQuickStats = [
    { label: "Last Vitals", value: "2 days ago", icon: HeartIcon, color: "text-rose-500", link: "vitals" },
    { label: "Pending Bills", value: 1, unit: "invoice", icon: CurrencyDollarIcon, color: "text-teal-600", link: "billing" },
    { label: "Last Prescription", value: "Citalopram", icon: DocumentTextIcon, color: "text-purple-600", link: "prescriptions" },
    { label: "Primary Care", value: "Dr. J. Wells", icon: UserCircleIcon, color: "text-blue-600", link: "team" },
];

const PatientHomepage = () => {
    // Fetches custom_id from the routing context (simulating authentication)
    const { custom_id } = useOutletContext(); 
    
    const [userName, setUserName] = useState("Patient");
    const [isNameLoading, setIsNameLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);

    // --- Data Fetching Effect (User Name) ---
    useEffect(() => {
        const fetchUserName = async () => {
            if (!custom_id) {
                setUserName("Patient");
                setIsNameLoading(false);
                return;
            }
            try {
                // Functional API call (mocked to fail for demonstration if needed)
                const res = await axios.get(`${API_BASE_URL}/api/profile/${custom_id}`);
                if (res.data && res.data.full_name) {
                    setUserName(res.data.full_name); 
                    setFetchError(false);
                } else {
                    setUserName("Unidentified User");
                }
            } catch (err) {
                console.error("Failed to fetch user name:", err);
                setUserName("Error Loading Name");
                setFetchError(true);
            } finally {
                setIsNameLoading(false);
            }
        };
        fetchUserName();
    }, [custom_id]);

    // Conditional Rendering for the User's Name
    const renderUserName = () => {
        if (isNameLoading) {
            return <span className="font-medium ml-2 text-gray-500">Loading...</span>;
        }
        if (fetchError) {
            return <span className="font-bold ml-2 text-red-500">{userName}</span>;
        }
        return <span className="font-bold ml-2 text-indigo-700">{userName.split(' ')[0] + (userName.includes(' ') ? ' ' + userName.split(' ')[1] : '')}</span>; // Use only first two words
    };


    return (
        <div className="p-4 sm:p-8 max-w-6xl mx-auto bg-gray-50 min-h-screen"> 
            
            <div className="space-y-6 lg:space-y-8">
                
                {/* ------------------------------------------------------------------ */}
                {/* --- 1. WELCOME & ALERT BLOCK (Highly Themed) --- */}
                {/* ------------------------------------------------------------------ */}
                <div className="bg-white p-5 md:p-8 rounded-2xl shadow-xl border-t-4 border-indigo-600">
                    <div className="flex justify-between items-start border-b pb-4 mb-4">
                        <div className="flex flex-col">
                            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                                Hello, 
                                {renderUserName()}
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Your **Personal Health Dashboard**. Everything is secure and up-to-date.
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Patient ID: <span className="font-mono font-medium">{custom_id || "N/A"}</span>
                            </p>
                        </div>
                        <Link
                            to="settings"
                            className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition ring-1 ring-gray-300"
                        >
                            <Cog6ToothIcon className="w-4 h-4 mr-1 text-gray-500" /> Settings
                        </Link>
                    </div>
                    
                    {/* Integrated Critical Alert Section (Highly Actionable) */}
                    <div className="p-4 bg-red-100 border border-red-400 rounded-xl flex items-start space-x-4 shadow-inner">
                        <BellAlertIcon className="w-6 h-6 text-red-700 flex-shrink-0 mt-0.5" />
                        <div>
                            <h2 className="text-base font-extrabold text-red-800 uppercase tracking-wider">Urgent Follow-up Required</h2>
                            <p className="text-sm text-red-700 mt-1">
                                New Lab Result Alert: **Glucose level (155 mg/dL)** is outside the normal range. Please schedule a follow-up consultation with your PCP.
                            </p>
                            <Link 
                                to={`appointments`}
                                className="mt-2 inline-flex items-center text-sm font-bold text-red-600 hover:text-red-800 transition"
                            >
                                Book Consultation Now <ArrowRightIcon className="ml-1 h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ------------------------------------------------------------------ */}
                {/* --- 2. PRIMARY DATA SUMMARY GRID (Themed Cards) --- */}
                {/* ------------------------------------------------------------------ */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    {mockSummaryData.map((item, index) => (
                        <Link 
                            key={index}
                            to={item.to}
                            className={`block ${item.bg} p-5 rounded-2xl border border-gray-200 shadow-lg transition duration-300 hover:shadow-2xl hover:ring-2 hover:ring-offset-2 hover:ring-indigo-500 group`}
                        >
                            <div className="flex justify-between items-center">
                                <item.icon className={`w-7 h-7 ${item.color} flex-shrink-0`} />
                                <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest">{item.label}</p>
                            </div>
                            
                            <div className="mt-3 border-t pt-3 border-gray-200">
                                <span className={`text-3xl font-extrabold ${item.color}`}>{item.value}</span>
                                {item.unit && <span className="text-sm font-semibold text-gray-500 ml-2">{item.unit}</span>}
                            </div>
                            
                            <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                            <span className="mt-3 block text-xs font-bold text-indigo-700 group-hover:underline">
                                Go to {item.label} $\rightarrow$
                            </span>
                        </Link>
                    ))}
                </div>

                {/* ------------------------------------------------------------------ */}
                {/* --- 3. QUICK STATS & BILLING CARD (Highly Detailed Grid) --- */}
                {/* ------------------------------------------------------------------ */}
                <div className="bg-white p-5 rounded-2xl shadow-xl border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Your Health Snapshot</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {mockQuickStats.map((stat, index) => (
                            <Link 
                                key={index}
                                to={stat.link}
                                className="flex flex-col p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition group"
                            >
                                <div className="flex items-center space-x-3 mb-2">
                                    <stat.icon className={`w-5 h-5 ${stat.color} flex-shrink-0`} />
                                    <p className="text-xs font-medium text-gray-500 uppercase">{stat.label}</p>
                                </div>
                                <p className="text-lg font-extrabold text-gray-800 truncate">
                                    {stat.value}
                                </p>
                                {stat.unit && <span className="text-xs text-gray-500 mt-0.5">{stat.unit}</span>}
                            </Link>
                        ))}
                    </div>
                    <Link 
                        to="billing" 
                        className="mt-5 block text-right text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition"
                    >
                        View Billing & Payments $\rightarrow$
                    </Link>
                </div>
                
                {/* ------------------------------------------------------------------ */}
                {/* --- 4. CORE MODULES (Expanded Action Grid) --- */}
                {/* ------------------------------------------------------------------ */}
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                    Direct Access Modules
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Module 1: Profile */}
                    <Link to="profile" className="flex items-center p-4 sm:p-5 bg-white border border-gray-200 rounded-xl transition hover:bg-indigo-50 group shadow-sm hover:shadow-md">
                        <UserCircleIcon className="w-7 h-7 text-indigo-700 mr-4 flex-shrink-0" />
                        <div>
                            <span className="font-semibold text-gray-800 text-base">Patient Profile & Details</span>
                            <p className="text-xs text-gray-500 mt-1">Manage personal info, contacts, and insurance.</p>
                        </div>
                        <ArrowRightIcon className="w-5 h-5 ml-auto text-gray-400 group-hover:text-indigo-600 transition" />
                    </Link>
                    
                    {/* Module 2: Records */}
                    <Link to="records" className="flex items-center p-4 sm:p-5 bg-white border border-gray-200 rounded-xl transition hover:bg-indigo-50 group shadow-sm hover:shadow-md">
                        <DocumentTextIcon className="w-7 h-7 text-indigo-700 mr-4 flex-shrink-0" />
                        <div>
                            <span className="font-semibold text-gray-800 text-base">Digital Medical Records</span>
                            <p className="text-xs text-gray-500 mt-1">View lab results, scans, prescriptions, and documents.</p>
                        </div>
                        <ArrowRightIcon className="w-5 h-5 ml-auto text-gray-400 group-hover:text-indigo-600 transition" />
                    </Link>

                    {/* Module 3: Appointments */}
                    <Link to="appointments" className="flex items-center p-4 sm:p-5 bg-white border border-gray-200 rounded-xl transition hover:bg-indigo-50 group shadow-sm hover:shadow-md">
                        <CalendarDaysIcon className="w-7 h-7 text-indigo-700 mr-4 flex-shrink-0" />
                        <div>
                            <span className="font-semibold text-gray-800 text-base">Schedule & Manage Visits</span>
                            <p className="text-xs text-gray-500 mt-1">Book new or view/cancel existing appointments and telehealth sessions.</p>
                        </div>
                        <ArrowRightIcon className="w-5 h-5 ml-auto text-gray-400 group-hover:text-indigo-600 transition" />
                    </Link>

                    {/* Module 4: Billing & Payments (New dedicated module) */}
                    <Link to="billing" className="flex items-center p-4 sm:p-5 bg-white border border-gray-200 rounded-xl transition hover:bg-indigo-50 group shadow-sm hover:shadow-md">
                        <ReceiptRefundIcon className="w-7 h-7 text-indigo-700 mr-4 flex-shrink-0" />
                        <div>
                            <span className="font-semibold text-gray-800 text-base">Billing & Payments</span>
                            <p className="text-xs text-gray-500 mt-1">Review invoices, manage payment methods, and insurance claims.</p>
                        </div>
                        <ArrowRightIcon className="w-5 h-5 ml-auto text-gray-400 group-hover:text-indigo-600 transition" />
                    </Link>
                    
                    {/* Module 5: Messaging (Communication) */}
                    <Link to="messages" className="flex items-center p-4 sm:p-5 bg-white border border-gray-200 rounded-xl transition hover:bg-indigo-50 group shadow-sm hover:shadow-md">
                        <ChatBubbleLeftRightIcon className="w-7 h-7 text-indigo-700 mr-4 flex-shrink-0" />
                        <div>
                            <span className="font-semibold text-gray-800 text-base">Secure Messaging</span>
                            <p className="text-xs text-gray-500 mt-1">Communicate directly with your care team securely.</p>
                        </div>
                        <ArrowRightIcon className="w-5 h-5 ml-auto text-gray-400 group-hover:text-indigo-600 transition" />
                    </Link>

                    {/* Module 6: Support */}
                    <Link to="support" className="flex items-center p-4 sm:p-5 bg-white border border-gray-200 rounded-xl transition hover:bg-indigo-50 group shadow-sm hover:shadow-md">
                        <LifebuoyIcon className="w-7 h-7 text-indigo-700 mr-4 flex-shrink-0" />
                        <div>
                            <span className="font-semibold text-gray-800 text-base">Help & Technical Support</span>
                            <p className="text-xs text-gray-500 mt-1">Get immediate help, read FAQs, or submit a technical ticket.</p>
                        </div>
                        <ArrowRightIcon className="w-5 h-5 ml-auto text-gray-400 group-hover:text-indigo-600 transition" />
                    </Link>
                </div>
                
                {/* ------------------------------------------------------------------ */}
                {/* --- 5. FOOTER SECURITY/COMPLIANCE BAR (Enhanced) --- */}
                {/* ------------------------------------------------------------------ */}
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200 text-sm text-gray-700 mt-8 shadow-inner">
                    <div className="flex justify-between items-center flex-wrap">
                        <p className="flex items-center text-xs sm:text-sm font-medium mb-2 sm:mb-0 text-indigo-700">
                            <ShieldCheckIcon className="w-4 h-4 inline mr-2 text-green-600 flex-shrink-0" />
                            **Data Security:** All information is secured and compliant with **HIPAA** and **GDPR**.
                        </p>
                        <Link 
                            to="settings/security"
                            className="font-bold text-indigo-600 hover:text-indigo-800 transition text-xs sm:text-sm"
                        >
                            View Compliance Details $\rightarrow$
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PatientHomepage;