import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiBell, FiClock } from "react-icons/fi";
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

const Notifications = () => {
  const [reminders, setReminders] = useState([]);
  const [medicineName, setMedicineName] = useState("");
  const [time, setTime] = useState("");
  const [phone, setPhone] = useState("");
  const [frequency, setFrequency] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);


  // Fetch medicine list
useEffect(() => {
  const fetchMedicines = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/medicines`);
      setMedicines(data);
    } catch (err) {
      console.error("Error fetching medicines:", err);
    }
  };
  fetchMedicines();
}, []);

  // ✅ Fetch user once, then reminders after that
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser?.custom_id) {
          console.warn("No user found in localStorage");
          return;
        }

        setUser(storedUser);

        // Get user profile (for phone)
        const res = await axios.get(`${API_BASE}/profile/${storedUser.custom_id}`);
        if (res.data) {
          setPhone(res.data.phone_number || "");
        }

        // Fetch reminders *after* setting user
        fetchReminders(storedUser.custom_id);
      } catch (err) {
        console.error("Error fetching user or reminders:", err);
      }
    };
    fetchUser();
  }, []);

  // ✅ Fetch reminders function
  const fetchReminders = async (custom_id) => {
    try {
      const { data } = await axios.get(`${API_BASE}/reminders/${custom_id}`);
      setReminders(data || []);
    } catch (err) {
      console.error("Error fetching reminders:", err);
    }
  };

  // ✅ Add new reminder
  const handleAddReminder = async (e) => {
    e.preventDefault();
    if (!medicineName || !time || !phone || !frequency)
      return alert("Please fill all fields!");

    if (!user?.custom_id)
      return alert("User not found. Please log in again.");

    setLoading(true);
    try {
      await axios.post(`${API_BASE}/reminders`, {
        custom_id: user.custom_id,
        medicine_name: medicineName,
        reminder_time: time,
        phone_number: phone,
        reminder_frequency: frequency,
      });

      fetchReminders(user.custom_id);

      setMedicineName("");
      setTime("");
      setFrequency("");
    } catch (err) {
      console.error("Error adding reminder:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-green-50 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-10">
      {/* WhatsApp Activation Notice */}
      <div className="flex items-center justify-between bg-green-50 border border-green-200 text-gray-700 text-sm px-4 py-2 rounded-lg mb-4 w-full max-w-3xl">
        <span>
          ⏰ If your number isn’t registered,{" "}
          <a
            href="https://api.whatsapp.com/send/?phone=%2B14155238886&text=join+themselves-middle&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-700 font-semibold hover:underline"
          >
            click here
          </a>{" "}
          and send{" "}
          <code className="bg-green-100 px-1 rounded">join themselves-middle</code>{" "}
          on WhatsApp.
        </span>
        <button
          onClick={() => navigator.clipboard.writeText("join pitch-after")}
          className="ml-2 bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 rounded-md"
        >
          Copy
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-white/80 backdrop-blur-2xl border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-6 sm:p-8"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-100 rounded-2xl">
            <FiBell className="text-2xl text-indigo-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
            Medicine Reminders
          </h2>
        </div>

        {/* Add Reminder Form */}
        {/* Add Reminder Form */}
<form
  onSubmit={handleAddReminder}
  className="mb-8 bg-white/70 backdrop-blur-xl p-4 rounded-2xl border border-gray-100 shadow-sm"
>
  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
    <select
      value={medicineName}
      onChange={(e) => {
        setMedicineName(e.target.value);
        const selected = medicines.find((m) => m.name === e.target.value);
        setSelectedMedicine(selected || null);
      }}
      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none bg-white/60"
    >
      <option value="">Select Medicine</option>
      {medicines.map((m, i) => (
        <option key={i} value={m.name}>
          {m.name}
        </option>
      ))}
    </select>

    <input
      type="time"
      value={time}
      onChange={(e) => setTime(e.target.value)}
      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none bg-white/60"
    />
    <input
      type="text"
      placeholder="Phone number"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none bg-white/60"
    />
    <select
      value={frequency}
      onChange={(e) => setFrequency(e.target.value)}
      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none bg-white/60"
    >
      <option value="">Frequency</option>
      <option value="Daily">Daily</option>
      <option value="Weekly">Weekly</option>
      <option value="Custom">Custom</option>
    </select>
    <button
      type="submit"
      disabled={loading}
      className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
    >
      {loading ? "Adding..." : "Add"}
    </button>
  </div>
</form>

{/* Medicine Info */}
{selectedMedicine && (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="mb-8 bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 shadow-sm"
  >
    <h4 className="text-lg font-semibold text-indigo-700 mb-1">
      {selectedMedicine.name}
    </h4>
    <p className="text-sm text-gray-700">
      <strong>Category:</strong> {selectedMedicine.category} <br />
      <strong>Type:</strong> {selectedMedicine.type} <br />
      <strong>Usage:</strong> {selectedMedicine.usage} <br />
      <strong>Dosage:</strong> {selectedMedicine.dosage}
    </p>
  </motion.div>
)}


        {/* Reminders List */}
        {reminders.length > 0 ? (
          <div className="space-y-4">
            {reminders.map((rem, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.01, y: -2 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-white/60 backdrop-blur-md border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                    <FiClock className="text-lg" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm sm:text-base font-semibold text-gray-800">
                      {rem.medicine_name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                      Time: {rem.reminder_time} • {rem.reminder_frequency}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-gray-500">
            <FiBell className="text-5xl mb-2 text-indigo-400 opacity-80" />
            <p className="text-sm font-medium">No reminders set yet 💭</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Notifications;
