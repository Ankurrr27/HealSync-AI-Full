import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiBell, FiClock, FiPlus } from "react-icons/fi";
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

const Notifications = () => {
  const [reminders, setReminders] = useState([]);
  const [medicineName, setMedicineName] = useState("");
  const [time, setTime] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const [expandedMedicine, setExpandedMedicine] = useState(null);
  const [medicineDetails, setMedicineDetails] = useState([]);
  const [loadingMedicine, setLoadingMedicine] = useState(false);

  const custom_id = "user123";

  // fetch all reminders
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

  // add reminder
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

  // fetch + open roll-down immediately
  const handleMedicineClick = async (name) => {
    if (expandedMedicine === name) return setExpandedMedicine(null);

    setExpandedMedicine(name);
    setMedicineDetails([]);
    setLoadingMedicine(true);

    try {
      const [res1, res2] = await Promise.all([
        axios.get("https://6904bb336b8dabde4964e4ab.mockapi.io/medicine1"),
        axios.get("https://6904bb336b8dabde4964e4ab.mockapi.io/medicine2"),
      ]);

      const combined = [...res1.data, ...res2.data];
      const filtered = combined.filter(
        (m) =>
          m.name?.toLowerCase().includes(name.toLowerCase()) ||
          m.medicine?.toLowerCase().includes(name.toLowerCase())
      );

      setMedicineDetails(filtered);
    } catch (err) {
      console.error("Error fetching medicine details:", err);
    } finally {
      setLoadingMedicine(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-green-50 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-white/80 backdrop-blur-2xl border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-6 sm:p-8"
      >
        {/* header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-100 rounded-2xl">
            <FiBell className="text-2xl text-indigo-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
            Medicine Reminders 💊
          </h2>
        </div>

        {/* add reminder */}
        <form
          onSubmit={handleAddReminder}
          className="mb-10 bg-white/70 backdrop-blur-xl p-5 rounded-2xl border border-gray-100 shadow-sm"
        >
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <FiPlus className="text-indigo-500" /> Add Reminder
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Medicine name"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none bg-white/60"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none bg-white/60"
            />
            <input
              type="text"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none bg-white/60"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
          >
            {loading ? "Adding..." : "Add Reminder"}
          </button>
        </form>

        {/* reminders */}
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
                    <button
                      onClick={() => handleMedicineClick(rem.medicine_name)}
                      className="text-sm sm:text-base font-semibold text-gray-800 hover:text-indigo-600 transition"
                    >
                      {rem.medicine_name}
                    </button>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                      Time: {rem.reminder_time}
                    </p>
                    <p className="text-[11px] sm:text-xs text-gray-400 mt-2 italic">
                      Status: {rem.status}
                    </p>
                  </div>
                </div>

                {/* dropdown roll-down */}
                <AnimatePresence>
                  {expandedMedicine === rem.medicine_name && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pl-12 overflow-hidden"
                    >
                      {loadingMedicine ? (
                        <p className="text-sm text-gray-400 italic">
                          Loading details...
                        </p>
                      ) : medicineDetails.length > 0 ? (
                        <ul className="space-y-1">
                          {medicineDetails.map((m, idx) => (
                            <li
                              key={idx}
                              className="text-sm bg-indigo-50 px-3 py-1 rounded-lg text-gray-700"
                            >
                              💊 {m.name || m.medicine}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-400 italic">
                          No extra details found for this medicine.
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
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
