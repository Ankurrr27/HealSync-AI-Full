import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaUserMd, FaSave } from "react-icons/fa";
import { FiCamera } from "react-icons/fi";

const API_BASE = "http://localhost:5000/api/doctor";

const DoctorProfile = () => {
  const { custom_id } = useParams();
  const [profile, setProfile] = useState({
    full_name: "",
    specialization: "",
    qualification: "",
    experience_years: "",
    gender: "Male",
    contact_number: "",
    email: "",
    clinic_address: "",
    availability: "",
    profile_image: null,
  });

  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // --- Fetch doctor profile ---
  useEffect(() => {
    if (!custom_id) return;

    axios
      .get(`${API_BASE}/${custom_id}`)
      .then((res) => {
        setProfile(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching doctor profile:", err);
        setMsg("Error loading doctor profile ❌");
        setIsLoading(false);
      });
  }, [custom_id]);

  // --- Handle input ---
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // --- Handle file upload ---
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setProfile({ ...profile, profile_image: URL.createObjectURL(selectedFile) });
  };

  // --- Submit updated profile ---
const handleSubmit = async (e) => {
  e.preventDefault();
  setMsg("Saving profile...");

  const formData = new FormData();
  formData.append("custom_id", String(custom_id));

  for (let key in profile) {
    if (key !== "profile_image") formData.append(key, profile[key] || "");
  }

  if (file) formData.append("profile_image", file);

  try {
    const res = await axios.post(`${API_BASE}/create`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setProfile(res.data.profile); // 🔑 update state with returned profile
    setFile(null);
    setMsg("Profile saved successfully! ✅");
  } catch (error) {
    console.error("Error saving doctor profile:", error);
    setMsg("Failed to save doctor profile ❌");
  }
};



  const getProfileImageSrc = () => {
    if (!profile.profile_image) return null;
    if (profile.profile_image.startsWith("blob:")) return profile.profile_image;
    return `http://localhost:5000/${profile.profile_image}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-xl font-semibold text-blue-600">Loading Doctor Profile...</div>
      </div>
    );
  }

  return (
    <div className=" min-h-90vh flex justify-center items-center px-4 py-1">
      <div className="w-full max-w-6xl rounded-3xl  p-4 md:p-12 grid md:grid-cols-3 gap-8">
        
        {/* --- LEFT PANEL --- */}
        <div className="md:col-span-1 flex flex-col items-center p-6 bg-white rounded-2xl  border-gray-100 hover:shadow-2xl transition-all duration-300">
          
          {/* Profile Image */}
          <div className="w-56 h-68 overflow-hidden bg-gray-100 flex items-center justify-center shadow-inner border-4 border-white  mb-6 relative">
            {profile.profile_image ? (
              <img
                src={getProfileImageSrc()}
                alt="Doctor"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            ) : (
              <FaUserMd className="text-gray-400 text-9xl" />
            )}

            {/* Upload Icon */}
            <label className="absolute bottom-1 right-1 bg-blue-200 text-black p-3 rounded-full cursor-pointer hover:bg-blue-300 transition-transform duration-300 hover:scale-110 shadow-xl border-2 border-white">
              <FiCamera className="text-xl" />
              <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
            </label>
          </div>

          {/* Info Summary */}
          <div className="text-center w-full space-y-2 mb-6">
            <h2 className="text-2xl font-extrabold text-gray-800">{profile.full_name || "Unnamed Doctor"}</h2>
            <p className="text-base text-gray-500 font-mono bg-gray-50 p-1 rounded-lg inline-block">
              <span className="font-semibold text-gray-700">ID:</span> {custom_id}
            </p>
            <div className="flex justify-center gap-4 text-sm text-gray-600 pt-1">
              <p><span className="font-semibold">Gender:</span> {profile.gender || "N/A"}</p>
              <p>•</p>
              <p><span className="font-semibold">Exp:</span> {profile.experience_years || "0"} yrs</p>
            </div>
          </div>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full flex items-center justify-center bg-green-600 text-white px-4 py-3 rounded-xl font-bold uppercase tracking-wider shadow-lg hover:bg-green-700 transition-all duration-300 hover:shadow-xl disabled:bg-gray-400"
            disabled={msg.includes("Saving")}
          >
            <FaSave className="mr-3 text-lg" /> {msg.includes("Saving") ? "Saving..." : "Save Profile"}
          </button>

          {msg && (
            <p
              className={`mt-4 text-sm font-medium text-center p-3 w-full rounded-xl shadow-inner ${
                msg.includes("success")
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {msg}
            </p>
          )}
        </div>

        {/* --- RIGHT PANEL (Form Fields) --- */}
        <form onSubmit={handleSubmit} className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5 auto-rows-min">
          {[
            { label: "Full Name", name: "full_name", type: "text", span: 2 },
            { label: "Specialization", name: "specialization", type: "text" },
            { label: "Qualification", name: "qualification", type: "text" },
            { label: "Experience (years)", name: "experience_years", type: "number" },
            { label: "Gender", name: "gender", type: "select", options: ["Male", "Female", "Other", "Prefer not to say"] },
            { label: "Contact Number", name: "contact_number", type: "tel" },
            { label: "Email", name: "email", type: "email", span: 2 },
            { label: "Clinic Address", name: "clinic_address", type: "text", span: 2 },
            { label: "Availability", name: "availability", type: "text", span: 2 },
          ].map((field) => (
            <div key={field.name} className={`flex flex-col ${field.span === 2 ? "sm:col-span-2" : ""}`}>
              <label htmlFor={field.name} className="text-sm font-semibold text-gray-700 mb-1">
                {field.label}
              </label>
              {field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={profile[field.name]}
                  onChange={handleChange}
                  className="p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm"
                >
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.name}
                  type={field.type}
                  name={field.name}
                  value={profile[field.name] || ""}
                  onChange={handleChange}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  className="p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                />
              )}
            </div>
          ))}

          <button type="submit" className="hidden" aria-hidden="true"></button>
        </form>
      </div>
    </div>
  );
};

export default DoctorProfile;
