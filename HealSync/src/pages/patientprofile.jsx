import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaUserCircle, FaSave } from "react-icons/fa";
import { FiCamera } from "react-icons/fi";

const API_BASE = "http://localhost:5000/api/profile";

const PatientProfile = () => {
  const { custom_id } = useParams();
  const [profile, setProfile] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "Male",
    blood_group: "",
    primary_doctor: "",
    mobile_number: "",
    email: "",
    current_address: "",
    profile_image: null,
  });
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    axios
      .get(`${API_BASE}/${custom_id}`)
      .then((res) => setProfile(res.data))
      .catch((err) => console.error("Error fetching profile:", err));
  }, [custom_id]);

  const handleChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFile(file);
    setProfile({ ...profile, profile_image: URL.createObjectURL(file) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("Saving profile...");
    const formData = new FormData();
    formData.append("custom_id", custom_id);
    for (let key in profile)
      if (key !== "profile_image") formData.append(key, profile[key]);
    if (file) formData.append("profile_image", file);

    try {
      await axios.post(`${API_BASE}/${custom_id}/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMsg("Profile saved successfully! ✅");
    } catch (error) {
      console.error("Error saving profile:", error);
      setMsg("Failed to save profile. ❌");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-start py-8">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6 md:p-10 grid md:grid-cols-3 gap-6 transform scale-95">
        
        {/* LEFT PANEL */}
        <div className="md:col-span-1 flex flex-col items-center p-4 bg-white rounded-xl shadow hover:shadow-2xl transition-shadow duration-300">
          <div className="w-52 h-52 rounded-xl overflow-hidden bg-gray-200 flex items-center justify-center shadow-inner border border-gray-200 mb-4 relative">
            {profile.profile_url ? (
              <img
                src={profile.profile_url}
                alt="Profile"
                className="w-full h-full object-cover rounded-xl transition-transform duration-300 transform hover:scale-105"
              />
            ) : (
              <FaUserCircle className="text-gray-400 text-6xl" />
            )}

            <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-blue-700 transition-transform duration-300 hover:scale-110 shadow-md">
              <FiCamera className="text-lg" />
              <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
            </label>
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-gray-800">{profile.full_name || "N/A"}</h2>
            <p className="text-xs text-gray-500"><span className="font-semibold">ID:</span> {custom_id}</p>
            <p className="text-xs text-gray-500"><span className="font-semibold">Blood:</span> {profile.blood_group || "N/A"}</p>
            <p className="text-xs text-gray-500"><span className="font-semibold">Gender:</span> {profile.gender || "N/A"}</p>
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="mt-4 w-full flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-green-700 transition-all duration-300 transform hover:scale-105 text-sm"
          >
            <FaSave className="mr-2 text-base" /> Save Profile
          </button>

          {msg && (
            <p className={`mt-3 text-xs font-medium text-center p-2 rounded-lg ${msg.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} shadow-inner`}>
              {msg}
            </p>
          )}
        </div>

        {/* RIGHT PANEL: Form Fields */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-min">
          {/* Full Name */}
          <div className="flex flex-col sm:col-span-2">
            <label className="text-xs font-semibold text-gray-600 mb-1">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={profile.full_name}
              onChange={handleChange}
              placeholder="Enter patient's full name"
              className="p-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
            />
          </div>

          {/* Date of Birth */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-600 mb-1">Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={profile.date_of_birth?.split("T")[0] || ""}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-600 mb-1">Gender</label>
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 bg-white"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
              <option>Prefer not to say</option>
            </select>
          </div>

          {/* Blood Group */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-600 mb-1">Blood Group</label>
            <input
              type="text"
              name="blood_group"
              value={profile.blood_group}
              onChange={handleChange}
              placeholder="e.g., A+, O-"
              className="p-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
            />
          </div>

          {/* Mobile Number */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-600 mb-1">Mobile Number</label>
            <input
              type="tel"
              name="mobile_number"
              value={profile.mobile_number}
              onChange={handleChange}
              placeholder="+91-XXXXX XXXXX"
              className="p-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col sm:col-span-2">
            <label className="text-xs font-semibold text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              placeholder="user@example.com"
              className="p-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
            />
          </div>

          {/* Primary Doctor */}
          <div className="flex flex-col sm:col-span-2">
            <label className="text-xs font-semibold text-gray-600 mb-1">Primary Doctor</label>
            <input
              type="text"
              name="primary_doctor"
              value={profile.primary_doctor}
              onChange={handleChange}
              placeholder="Dr. [Name]"
              className="p-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
            />
          </div>

          {/* Address */}
          <div className="flex flex-col sm:col-span-2">
            <label className="text-xs font-semibold text-gray-600 mb-1">Address</label>
            <textarea
              name="current_address"
              value={profile.current_address}
              onChange={handleChange}
              rows={3}
              placeholder="Full current address"
              className="p-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
