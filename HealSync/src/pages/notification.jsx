import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiBell, FiClock, FiPlus, FiPhone } from "react-icons/fi";
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

const Notifications = () => {
  const [reminders, setReminders] = useState([]);
  const [medicineName, setMedicineName] = useState("");
  const [time, setTime] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const custom_id = "user123"; // Replace with actual logged-in user ID

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/reminders/${custom_id}`);
        setReminders(data);
      } catch (err) {
        console.error("Error fetching reminders", err);
      }
    };
    fetchReminders();
  }, []);

  const handleAddReminder = async (e) => {
    e.preventDefault();
    if (!medicineName || !time || !phone)
      return alert("Please fill all fields!");
    setLoading(true);

    try {
      await axios.post(`${API_BASE}/reminders`, {
        custom_id,
        medicine_name: medicineName,
        reminder_time: time,
        phone_number: phone,
      });
      const { data } = await axios.get(`${API_BASE}/reminders/${custom_id}`);
      setReminders(data);
      setMedicineName("");
      setTime("");
      setPhone("");
    } catch (err) {
      console.error("Error adding reminder", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fbff] via-white to-[#eef6ff] flex flex-col items-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl bg-white/80 backdrop-blur-lg border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.05)] p-8"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-100 rounded-2xl">
            <FiBell className="text-2xl text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
            Medicine Reminders
          </h2>
        </div>

        {/* Add Reminder */}
        <motion.form
          onSubmit={handleAddReminder}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-10 bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-gray-100 shadow-sm"
        >
          <h3 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FiPlus className="text-indigo-500" /> Add New Reminder
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Medicine name"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none bg-white/60 placeholder-gray-400"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none bg-white/60"
            />
            <div className="relative">
              <FiPhone className="absolute left-3 top-3 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none bg-white/60 placeholder-gray-400 w-full"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-5 bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-2 w-fit"
          >
            {loading ? "Adding..." : "Add Reminder"}
          </button>
        </motion.form>

        {/* Reminder List */}
        {reminders.length > 0 ? (
          <div className="space-y-4">
            {reminders.map((rem, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="flex items-center gap-4 bg-white/60 backdrop-blur-md border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition"
              >
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                  <FiClock className="text-lg" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-gray-800">
                    {rem.medicine_name}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Time: <span className="font-medium">{rem.reminder_time}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1 italic">
                    Status: {rem.status}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-48 text-gray-500"
          >
            <FiBell className="text-5xl mb-2 text-indigo-400 opacity-80" />
            <p className="text-sm font-medium">
              No reminders set yet — stay consistent with your meds 💊
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Notifications;
